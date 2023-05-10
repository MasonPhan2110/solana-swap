import {Bot} from "./bot";
import * as anchor from "@project-serum/anchor";


const CONTROLLER_PDA_SEED = "controller";
const ESCROW_PDA_SEED = "escrow";


interface PDAParam {
    key: anchor.web3.PublicKey,
    bump: number
}

export class Swapper extends Bot { 
    tokenMint: anchor.web3.PublicKey;

    constructor(
        tokenMint: anchor.web3.PublicKey,
        provider?: anchor.AnchorProvider, 
        deployer?: anchor.web3.Keypair
    ){
        super(provider, deployer);
        this.program = anchor.workspace.SolanaSwap;
        this.tokenMint = tokenMint
    }


    getController = async(): Promise<PDAParam> => {
        const [pda, bump] = await anchor.web3.PublicKey
        .findProgramAddress(
            [
            anchor.utils.bytes.utf8.encode(CONTROLLER_PDA_SEED),
            ],
            this.program.programId
        );

        return {
            key: pda,
            bump: bump
        }
    }

    getEscrow = async(): Promise<PDAParam> => {
        const [pda, bump] = await anchor.web3.PublicKey
        .findProgramAddress(
            [
            anchor.utils.bytes.utf8.encode(ESCROW_PDA_SEED),
            ],
            this.program.programId
        );

        return {
            key: pda,
            bump: bump
        }
    }

    initialize = async(
        authorizer: anchor.web3.Keypair, 
        move_per_sol: number, 
        token_decimal: number
    )=> {
        let controllerPDA = await this.getController();
        let escrowPDA = await this.getEscrow();

        return await this.program.methods.initialize(move_per_sol, token_decimal).accounts({
            signer: authorizer.publicKey,
            tokenMint: this.tokenMint,
            controller: controllerPDA.key,
            escrow: escrowPDA.key
        }).signers([authorizer]).rpc();
    }


    buy_move = async(user: anchor.web3.Keypair, userTokenAccount: anchor.web3.PublicKey, amount: anchor.BN)=> {
        let controllerPDA = await this.getController();
        let escrowPDA = await this.getEscrow();

        return await this.program.methods.buyMove(amount).accounts({
            user: user.publicKey,
            controller: controllerPDA.key,
            tokenMint: this.tokenMint, 
            escrow: escrowPDA.key, 
            userTokenAccount: userTokenAccount
        }).signers([user]).rpc();
    }

    sell_move = async(user: anchor.web3.Keypair, userTokenAccount: anchor.web3.PublicKey, amount: anchor.BN)=> {
        let controllerPDA = await this.getController();
        let escrowPDA = await this.getEscrow();

        return await this.program.methods.sellMove(amount).accounts({
            user: user.publicKey,
            controller: controllerPDA.key,
            tokenMint: this.tokenMint, 
            escrow: escrowPDA.key, 
            userTokenAccount: userTokenAccount
        }).signers([user]).rpc();
    }
}