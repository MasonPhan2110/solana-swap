use anchor_lang::prelude::*;
const SOL_TO_LAMPORTS: u128 = 1000000000;

#[account]
pub struct Controller {
    pub authorizer: Pubkey,
    pub token_price: Vec<u64>,
    pub decimal: u8,
    pub sol_received: u64,
    pub sol_claimed: u64,
    pub bump: u8,
    pub escrow_bump: u8,
}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;

const U8_SIZE_LENGTH: usize = 1;
const TOKEN_PRICE_LENGTH: usize = 2 * 8 + 4; // 2 elements + 4 bytes prefix
const U64_SIZE_LENGTH: usize = 8;

impl Controller {
    //todo: implement LEN for the struct data
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH
        + TOKEN_PRICE_LENGTH
        + U8_SIZE_LENGTH * 3
        + U64_SIZE_LENGTH * 2;
    pub fn get_amount_move(&self, lamports: u128) -> u128 {
        let amount = lamports * 10u128.pow(self.decimal as u32)
            / (self.token_price[0] as u128 * SOL_TO_LAMPORTS);
        amount
    }
}
