import { world, system, MinecraftItemTypes, BlockLocation } from "@minecraft/server";

world.afterEvents.itemUse.subscribe((event) => {
  const player = event.source;

  // Only run if the source is a player
  if (!player || !player.getComponent) return;

  const inv = player.getComponent("minecraft:inventory").container;

  // Check slot 45 (off-hand)
  const offhandItem = inv.getItem(45);
  if (!offhandItem || offhandItem.typeId !== "minecraft:torch") return;

  // Try placing torch at the block the player is looking at
  const blockRay = player.getBlockFromViewVector();
  if (!blockRay) return;

  const block = blockRay.block;
  const above = block.location.offset(0, 1, 0);

  const dim = player.dimension;
  const blockAtAbove = dim.getBlock(above);

  if (blockAtAbove && blockAtAbove.typeId === "minecraft:air") {
    dim.setBlock(above, MinecraftItemTypes.torch.createDefaultBlockPermutation());
    inv.setItem(45, { ...offhandItem, amount: offhandItem.amount - 1 });
  }
});
