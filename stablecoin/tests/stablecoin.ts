import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Stablecoin } from "../target/types/stablecoin";
import { PythSolanaReceiver } from "@pythnetwork/pyth-solana-receiver";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

describe("stablecoin", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  const wallet = provider.wallet as anchor.Wallet;
  anchor.setProvider(provider);

  const program = anchor.workspace.Stablecoin as Program<Stablecoin>;

  const pythSolanaReceiver = new PythSolanaReceiver({ connection, wallet });
  const SOL_PRICE_FEED_ID =
    "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a";
  const solUsdPriceFeedAccount = pythSolanaReceiver
    .getPriceFeedAccountAddress(0, SOL_PRICE_FEED_ID)
    .toBase58();

  console.log(solUsdPriceFeedAccount);

  const [collateralAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("collateral"), wallet.publicKey.toBuffer()],
    program.programId
  );



  it("Is initialized!", async () => {
    // const tx = await program.methods
    //   .initializeConfig()
    //   .accounts({tokenProgram: TOKEN_PROGRAM_ID})
    //   .rpc({ skipPreflight: true, commitment: "confirmed" });
    // console.log("Your transaction signature", tx);

    const blockhashContext = await connection.getLatestBlockhash()
    const Ix = await program.methods
      .initializeConfig()
      .accounts({tokenProgram: TOKEN_PROGRAM_ID})
       .instruction();

   console.log('Your transaction signature', Ix)

   const tx = new anchor.web3.Transaction({
      blockhash: blockhashContext.blockhash,
      lastValidBlockHeight: blockhashContext.lastValidBlockHeight,
      feePayer: wallet.payer.publicKey,
    })
      .add(Ix)

      const signature = await anchor.web3.sendAndConfirmTransaction(connection, tx, [wallet.payer], {
      skipPreflight: true,
    })

 console.log('Your transaction signature', signature)



  });


it("Deposit Collateral and Mint USDC", async () => {
    const amountCollateral = 1_000_000_000;
    const amountToMint = 1_000_000_000;

    const blockhashContext = await connection.getLatestBlockhash()
    const DepositCollateralAndMintTokensIx = await program.methods
      .depositCollateralAndMintTokens(
        new anchor.BN(amountCollateral),
        new anchor.BN(amountToMint)
      ).accounts({ priceUpdate: solUsdPriceFeedAccount,tokenProgram: TOKEN_PROGRAM_ID })
       .instruction();

   console.log('Your transaction signature', DepositCollateralAndMintTokensIx)

   const tx = new anchor.web3.Transaction({
      blockhash: blockhashContext.blockhash,
      lastValidBlockHeight: blockhashContext.lastValidBlockHeight,
      feePayer: wallet.payer.publicKey,
    })
      .add(DepositCollateralAndMintTokensIx)

      const signature = await anchor.web3.sendAndConfirmTransaction(connection, tx, [wallet.payer], {
      skipPreflight: true,
    })
    console.log('Your transaction signature', signature)
      


    // const tx = await program.methods
    //   .depositCollateralAndMintTokens(
    //     new anchor.BN(amountCollateral),
    //     new anchor.BN(amountToMint)
    //   )
    //   .accounts({ priceUpdate: solUsdPriceFeedAccount,tokenProgram: TOKEN_PROGRAM_ID })
    //   .rpc({ skipPreflight: true, commitment: "confirmed" });
    // console.log("Your transaction signature", tx);
  });

  it("Redeem Collateral and Burn USDC", async () => {
    const amountCollateral = 500_000_000;
    const amountToBurn = 500_000_000;
    const tx = await program.methods
      .redeemCollateralAndBurnTokens(
        new anchor.BN(amountCollateral),
        new anchor.BN(amountToBurn)
      )
      .accounts({ priceUpdate: solUsdPriceFeedAccount,tokenProgram: TOKEN_PROGRAM_ID })
      .rpc({ skipPreflight: true, commitment: "confirmed" });
    console.log("Your transaction signature", tx);
  });

  // Increase minimum health threshold to test liquidate
  it("Update Config", async () => {
    const tx = await program.methods
      .updateConfig(new anchor.BN(100))
      .accounts({})
      .rpc({ skipPreflight: true, commitment: "confirmed" });
    console.log("Your transaction signature", tx);
  });

  it("Liquidate", async () => {
    const amountToBurn = 500_000_000;
    const tx = await program.methods
      .liquidate(new anchor.BN(amountToBurn))
      .accounts({ collateralAccount, priceUpdate: solUsdPriceFeedAccount,tokenProgram: TOKEN_PROGRAM_ID })
      .rpc({ skipPreflight: true, commitment: "confirmed" });
    console.log("Your transaction signature", tx);
  });

  it("Update Config", async () => {
    const tx = await program.methods
      .updateConfig(new anchor.BN(1))
      .accounts({})
      .rpc({ skipPreflight: true, commitment: "confirmed" });
    console.log("Your transaction signature", tx);
  });
});
