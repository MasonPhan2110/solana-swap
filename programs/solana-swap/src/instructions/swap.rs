use crate::errors::SwapErrors;
use crate::states::Controller;
use crate::{CONTROLLER_SEED, ESCROW_SEED};
use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{Mint, TokenAccount, Transfer};

pub fn swap(ctx: Context<Swap>, amount: u64) -> Result<()> {
    let user = &mut ctx.accounts.user;
    let controller = &mut ctx.accounts.controller;

    let escrow = &mut ctx.accounts.escrow;
    let user_token_account = &mut ctx.accounts.user_token_account;
    let token_program = &ctx.accounts.token_program;

    // Get SOL from the User
    controller.sol_received += amount;
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: user.to_account_info(),
            to: controller.to_account_info(),
        },
    );
    system_program::transfer(cpi_context, amount)?;

    // Transfer Move back to User
    let amounts_out = controller.get_amount_move(amount);

    require!(escrow.amount >= amounts_out, SwapErrors::InsufficientFund);
    let bump_vector = controller.bump.to_le_bytes();

    let inner = vec![CONTROLLER_SEED.as_bytes(), bump_vector.as_ref()];
    let outer = vec![inner.as_slice()];

    let transfer_ix = Transfer {
        from: escrow.to_account_info(),
        to: user_token_account.to_account_info(),
        authority: controller.to_account_info(),
    };

    let cpi_ctx = CpiContext::new_with_signer(
        token_program.to_account_info(),
        transfer_ix,
        outer.as_slice(),
    );
    anchor_spl::token::transfer(cpi_ctx, amounts_out)?;
    Ok(())
}

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [CONTROLLER_SEED.as_bytes()], bump = controller.bump
    )]
    pub controller: Account<'info, Controller>,

    #[account(
        mut,
        seeds = [ESCROW_SEED.as_bytes()], bump = controller.escrow_bump
    )]
    pub escrow: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = token_mint,
        associated_token::authority = user,
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,

    /// CHECK: This is not dangerous
    pub token_program: AccountInfo<'info>,
    pub associated_token_program: AccountInfo<'info>,
}
