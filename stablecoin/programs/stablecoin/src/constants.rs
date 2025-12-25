use anchor_lang::prelude::*;

pub const SEED_CONFIG_ACCOUNT: &[u8] = b"config";
pub const SEED_COLLATERAL_ACCOUNT: &[u8] = b"collateral";
pub const SEED_SOL_ACCOUNT: &[u8] = b"sol";
pub const SEED_MINT_ACCOUNT: &[u8] = b"mint";

#[constant]
pub const FEED_ID: &str = "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a";
pub const MAXIMUM_AGE: u64 = 100; // allow pricefeed 100 sec old, to avoid stale price feed errors
pub const PRICE_FEED_DECIMAL_ADJUSTMENT: u128 = 10; // price feed returns 1e8, multiple by 10 to match lamports 10e9

// Constants for configuration values
pub const LIQUIDATION_THRESHOLD: u64 = 50; // 200% over-collateralized
pub const LIQUIDATION_BONUS: u64 = 10; // 10% bonus lamports when liquidating
pub const MIN_HEALTH_FACTOR: u64 = 1;
pub const MINT_DECIMALS: u8 = 9;