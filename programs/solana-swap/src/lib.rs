use anchor_lang::prelude::*;
mod constants;
use crate::constants::*;
pub mod errors;
pub mod instructions;
pub mod states;

use instructions::*;
declare_id!("7ipVQZA9K5XJYjJbBZzp4USPsfJyxWSmACqVRWAp2aa2");

#[program]
pub mod solana_swap {

    use super::*;

    pub fn initialize(ctx: Context<Initialize>, move_per_sol: u8, decimal: u8) -> Result<()> {
        instructions::initialize::initialize(ctx, move_per_sol, decimal)
    }
    pub fn buy_move(ctx: Context<BuyMove>, amount: u64) -> Result<()> {
        instructions::swap::buy_move(ctx, amount)
    }
    pub fn sell_move(ctx: Context<SellMove>, amount: u64) -> Result<()> {
        instructions::swap::sell_move(ctx, amount)
    }
    pub fn deposit_liquidity(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        instructions::deposit_liquidity::deposit(ctx, amount)
    }
    pub fn remove_liquidity(ctx: Context<Remove>, amount: u64) -> Result<()> {
        instructions::remove_liquidity::remove(ctx, amount)
    }
}
