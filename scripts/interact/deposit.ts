import { Swapper } from "../bot/swapper";
import * as anchor from "@project-serum/anchor";

import {env} from "../env";
import { getAtaAccount, transferToken } from "../utils/token";


const MOVE_DECIMAL = 6;
const MOVE_PRICE = [new anchor.BN(10), new anchor.BN(1)]; // 1 move = 0.1 SOL


const  main= async()=>{
    const swap_token = new anchor.web3.PublicKey(env.swap_token);
    const swapper = new Swapper(swap_token);
    let escrow = await swapper.getEscrow();

    let deployerATA = await getAtaAccount(swap_token, swapper.deployer.publicKey);
    const depositAmount = 100000000000; // 100,000 MOVE
    await transferToken(swapper.provider, deployerATA, escrow.key, swapper.deployer, depositAmount);
}
  
main().catch(error => console.log(error));