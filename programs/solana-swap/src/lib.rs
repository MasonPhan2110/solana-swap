use anchor_lang::prelude::*;
mod constants;
use crate::constants::*;
pub mod errors;
pub mod instructions;
pub mod states;

use instructions::*;
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_swap {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, token_price: Vec<u64>, decimal: u8) -> Result<()> {
        instructions::initialize::initialize(ctx, token_price, decimal)
    }
    pub fn swap(ctx: Context<Swap>, amount: u64) -> Result<()> {
        instructions::swap::swap(ctx, amount)
    }
}
