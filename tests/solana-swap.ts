import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Swapper } from "../scripts/bot/swapper";
import { createMintToken, createUserAndAssociatedWallet, getSplBalance, transferToken } from "../scripts/utils/token";
import { SolanaSwap } from "../target/types/solana_swap";
import * as assert from "assert";


const MOVE_DECIMAL = 6;
const MOVE_PER_SOL = 10;
const solAmount = new anchor.BN(1000000000); // Bob is going to swap 1 SOL for 10 MOVE
const moveAmount = new anchor.BN(10000000)
let expectedReceiveAmount= null; // Expected amount that Bob is going to receive
const depositAmount = 10000000; // Amount that alice use to deposit to the escrow (add liquidity)
describe("solana-swap", () => {
   // Configure the client to use the local cluster.
   const provider = anchor.AnchorProvider.env();
   anchor.setProvider(provider);
 
   const program = anchor.workspace.SolanaSwapDapp as Program<SolanaSwap>;

   let swapper: Swapper;
 
   // We are going to work with this MOVE token latter
   let token_mint: anchor.web3.PublicKey;
 
   let deployer: anchor.web3.Keypair;
   let deployer_token_wallet: anchor.web3.PublicKey;
 
   let alice: anchor.web3.Keypair;
   let alice_token_wallet: anchor.web3.PublicKey;
 
   let bob: anchor.web3.Keypair;
   let bob_token_wallet: anchor.web3.PublicKey;
 
   const SOL_TO_LAMPORT = new anchor.BN(1000000000)
 
   const INITIAL_DEPLOYER_BALANCE = BigInt(1000000000000);
   const INITIAL_ALICE_TOKEN_BALANCE = BigInt(10000000000);

   it("Set up test space!", async () => {
    
    /**
     * Swapper: the contract instance in which we can use to test and interact with the blockchain 
     * 
     * token_mint: The mint address of the MOVE token. 
     * 
     * deployer, deployer_token_wallet: The initializer of the contract (The escrow contract token - not added yet)
     * alice - alice_token_wallet: Alice wallet is created, and she will get some MOVE tokens.  Alice will be the one who provide liquidity by putting MOVE token in to the escrow
     * bob - bob_token_wallet: Bob and his ata token account will be created, but he gets no MOVE token initially
     */
    token_mint = await createMintToken(provider, MOVE_DECIMAL);
    
    [deployer, deployer_token_wallet] = await createUserAndAssociatedWallet(provider,token_mint,true, INITIAL_DEPLOYER_BALANCE); 
    [alice, alice_token_wallet] = await createUserAndAssociatedWallet(provider,token_mint,true, INITIAL_ALICE_TOKEN_BALANCE);
    [bob, bob_token_wallet] = await createUserAndAssociatedWallet(provider,token_mint,false); 

    swapper = new Swapper(token_mint, provider, deployer);
  });
  it("Inititalize", async()=>{
    await swapper.initialize(deployer, MOVE_PER_SOL, MOVE_DECIMAL);

    let controller = await swapper.getController();
    let escrow = await swapper.getEscrow();

    let controllerInfo =  await swapper.provider.connection.getAccountInfo(controller.key);
    let escrowInfo =  await swapper.provider.connection.getAccountInfo(controller.key);

    assert.ok(controllerInfo.lamports > 0, "Controller has not been created");
    assert.ok(escrowInfo.lamports > 0, "Escrow has not been created");
  })
  it("Deposit", async()=>{
    const controller = await swapper.getController();
    let controllerInfo = await swapper.provider.connection.getAccountInfo(controller.key);
    let controllerBalanceBeforeSwap = controllerInfo.lamports;

    let deployerInfo = await swapper.provider.connection.getAccountInfo(deployer.publicKey);
    let deployerBalanceBeforeSwap = deployerInfo.lamports;
    console.log("deployer balance ", deployerBalanceBeforeSwap);
    

    let deployerTokenBalanceBefore = await getSplBalance(swapper.provider, deployer_token_wallet);
    await swapper.deposit(deployer, deployer_token_wallet, solAmount);

    let deployerTokenBalanceAfter = await getSplBalance(swapper.provider, deployer_token_wallet);
    console.log("deployer balance ", deployerTokenBalanceAfter);

    controllerInfo = await swapper.provider.connection.getAccountInfo(controller.key);
    let controllerBalanceAfterSwap = controllerInfo.lamports;

    deployerInfo = await swapper.provider.connection.getAccountInfo(deployer.publicKey);
    let deployerBalanceAfterSwap = deployerInfo.lamports;
     // ASSERTION
    /**
     * Controller SOL balance should increase by: 1 SOL (10^9 lamports)
     * Escrow balance should increase by: 10 MOVE (10 * 10^MOVE_DECIMAL) 
     */
    assert.ok(deployerBalanceBeforeSwap - deployerBalanceAfterSwap >= solAmount.toNumber(), "Deployer balance should be deducted by an amount greater than 1 SOL");
    assert.ok(controllerBalanceAfterSwap - controllerBalanceBeforeSwap == solAmount.toNumber(), "Controller Balance should increase by an swap amount");
    
    let expectedTokenAmount = solAmount.mul(new anchor.BN(MOVE_PER_SOL)).mul(new anchor.BN(10).pow(new anchor.BN(MOVE_DECIMAL))).div(SOL_TO_LAMPORT)
    assert.ok(Number(deployerTokenBalanceBefore) - Number(deployerTokenBalanceAfter) == expectedTokenAmount.toNumber(), "Deployer Token balance should decrease by expected amount");
  })
  it("Buy Move", async()=>{ 
    const controller = await swapper.getController();
    let controllerInfo = await swapper.provider.connection.getAccountInfo(controller.key);
    let controllerBalanceBeforeSwap = controllerInfo.lamports;
    
    let bobInfo = await swapper.provider.connection.getAccountInfo(bob.publicKey);
    let bobBalanceBeforeSwap = bobInfo.lamports;

    // Bob buy Move
    await swapper.buy_move(bob, bob_token_wallet, solAmount);

    controllerInfo = await swapper.provider.connection.getAccountInfo(controller.key);
    let controllerBalanceAfterSwap = controllerInfo.lamports;

    bobInfo = await swapper.provider.connection.getAccountInfo(bob.publicKey);
    let bobBalanceAfterSwap = bobInfo.lamports;

     // ASSERTION
    /**
     * Controller SOL balance should increase by: 1 SOL (10^9 lamports)
     * Bob token wallet balance should increase by: 10 MOVE (10 * 10^MOVE_DECIMAL) 
     */
    assert.ok(bobBalanceBeforeSwap - bobBalanceAfterSwap >= solAmount.toNumber(), "Bob balance should be deducted by an amount greater than 1 SOL"); // bob pay some lamports for gas fee 
    assert.ok(controllerBalanceAfterSwap - controllerBalanceBeforeSwap == solAmount.toNumber(), "Controller Balance should increase by an swap amount");
    let bobMoveBalance = await getSplBalance(swapper.provider, bob_token_wallet);
    expectedReceiveAmount = solAmount.mul(new anchor.BN(MOVE_PER_SOL)).mul(new anchor.BN(10).pow(new anchor.BN(MOVE_DECIMAL))).div(SOL_TO_LAMPORT)
    assert.ok(expectedReceiveAmount.toNumber() == Number(bobMoveBalance), "Bob receive an incorect amount");
  })  
  // Todo: Test Sell Move

  it("Sell Move", async()=>{
    const controller = await swapper.getController();
    let controllerInfo = await swapper.provider.connection.getAccountInfo(controller.key);

    expectedReceiveAmount = moveAmount.mul(SOL_TO_LAMPORT).div(new anchor.BN(MOVE_PER_SOL)).div(new anchor.BN(10).pow(new anchor.BN(MOVE_DECIMAL)))
    console.log("Expected Sol Receive: ",Number(expectedReceiveAmount));

    let controllerBalanceBeforeSwap = controllerInfo.lamports;
    console.log("Controller Sol Balance", Number(controllerBalanceBeforeSwap));

    let bobInfo = await swapper.provider.connection.getAccountInfo(bob.publicKey);
    let bobBalanceBeforeSwap = bobInfo.lamports;

    let escrow = await swapper.getEscrow(); 
    let escowInfo = await swapper.provider.connection.getAccountInfo(escrow.key);
    let escrowTokenBalanceBeforeSwap = await getSplBalance(swapper.provider, escrow.key);
    console.log("Escrow Token Balance", Number(escrowTokenBalanceBeforeSwap));
    

    // Bob sell Move
    await swapper.sell_move(bob, bob_token_wallet, moveAmount);

    controllerInfo = await swapper.provider.connection.getAccountInfo(controller.key);
    let controllerBalanceAfterSwap = controllerInfo.lamports;

    bobInfo = await swapper.provider.connection.getAccountInfo(bob.publicKey);
    let bobBalanceAfterSwap = bobInfo.lamports;


    escowInfo = await swapper.provider.connection.getAccountInfo(escrow.key);
    let escrowTokenBalanceAfterSwap = await getSplBalance(swapper.provider, escrow.key);


    // ASSERTION
    /**
     * Controller SOL balance should decrease by: 1 SOL (10^9 lamports)
     * Bob token wallet balance should decrease by: 10 MOVE (10 * 10^MOVE_DECIMAL) 
     * Bob Sol balance should increase by: 1 SOL (10^9 laports)
     * Escrow token balance should increase by 10 MOVE (10 * 10^MOVE_DECIMAL)
     */
    
    
    assert.ok(bobBalanceAfterSwap - bobBalanceBeforeSwap >= 0, "Bob Sol balance should be increase");
    assert.ok(controllerBalanceBeforeSwap- controllerBalanceAfterSwap == expectedReceiveAmount.toNumber(), "Controller Balance should decrease by an expected SOl");
    assert.ok(Number(escrowTokenBalanceAfterSwap) - Number(escrowTokenBalanceBeforeSwap) == moveAmount.toNumber(), "Escrow should increase 10 Move")
    let bobMoveBalance = await getSplBalance(swapper.provider, bob_token_wallet);
    assert.ok(Number(bobMoveBalance) == 0, "Bob token balance should be 0");
  })
  it("Remove", async()=>{

  })
});
