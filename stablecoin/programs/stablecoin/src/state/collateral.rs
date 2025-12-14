use anchor_lang::prelude::*;

#[account]
#[derive(Debug, InitSpace)]
pub struct Collateral {
    pub depositor: Pubkey,     // depositor wallet address
    pub sol_account: Pubkey,   // depositor pda collateral account (deposit SOL to this account)
    pub token_account: Pubkey, // depositor ata token account (mint stablecoins to this account)
    pub lamport_balance: u64, // current lamport balance of depositor sol_account (for health check calculation)
    pub amount_minted: u64, // current amount stablecoins minted, base unit adjusted for decimal precision (for health check calculation)
    pub bump: u8,           // store bump seed for this collateral account PDA
    pub bump_sol_account: u8, // store bump seed for the  sol_account PDA
    pub is_initialized: bool, // indicate if account data has already been initialized (for check to prevent overriding certain fields)
}