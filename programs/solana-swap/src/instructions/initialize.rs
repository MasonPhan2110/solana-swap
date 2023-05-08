use crate::errors::SwapErrors;
use crate::states::Controller;
use crate::{CONTROLLER_SEED, ESCROW_SEED};
use anchor_spl::token::{ Mint, TokenAccount};
use anchor_lang::prelude::*;

pub fn initialize(ctx: Context<Initialize>, token_price: Vec<u64>, decimal: u8) -> Result<()> {
    require!(token_price.len() == 2, SwapErrors::InvalidPrice);
    let controller = &mut ctx.accounts.controller;
    controller.authorizer = ctx.accounts.signer.key();
    controller.token_price = token_price;
    controller.decimal = decimal;
    controller.sol_received = 0;
    controller.sol_claimed = 0;
    controller.bump = *ctx.bumps.get(CONTROLLER_SEED).unwrap();
    controller.escrow_bump = *ctx.bumps.get(ESCROW_SEED).unwrap();
    msg!("action: initialize");
    msg!("authorizer: {}", ctx.accounts.signer.key());
    Ok(())
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = signer,
        space = Controller::LEN,
        seeds = [CONTROLLER_SEED.as_bytes()],
        bump
    )]
    pub controller: Account<'info, Controller>,
    #[account(
        init, 
        payer=signer,
        seeds=[ESCROW_SEED.as_ref(), token_mint.key().as_ref(), id.as_ref()],
        bump,
        token::mint=token_mint,
        token::authority=controller,
    )]
    pub escrow: Account<'info, TokenAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub token_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
}
