// register the blocks
StartupEvents.registry('block', event => {
  const $SoundType = Java.loadClass("net.minecraft.world.level.block.SoundType")
  const $Direction = Java.loadClass("net.minecraft.core.Direction")
  const $Blocks = Java.loadClass("net.minecraft.world.level.block.Blocks")
  const $AmethystClusterBlock = Java.loadClass("net.minecraft.world.level.block.AmethystClusterBlock")
  const $Boolean = Java.loadClass("java.lang.Boolean")
  const $Fluids = Java.loadClass("net.minecraft.world.level.material.Fluids")
  const $BlockBehaviourProperties = Java.loadClass("net.minecraft.world.level.block.state.BlockBehaviour$Properties")
  const $PushReaction = Java.loadClass("net.minecraft.world.level.material.PushReaction")

  // chance that a side is picked to grow every random tick (lower = faster growth, min 1)
  const GROWTH_CHANCE = 5 

  // register the budding block
  event.create("kubejs:budding")
    .hardness(1.5) // how much time it takes to break (higher = more time, 0 or omit for instant break)
    .resistance(1.5) // explosion resistance (higher = more resistant, 0 or omit for no resistance)
    .soundType($SoundType.AMETHYST) // sound the block makes, see https://github.com/Minimaxi28/Minimaxi-s-KubeJS-Things/wiki/1.20.1#soundtype
    .noDrops() // the block doesn't drop when broken (otherwise KubeJS automatically adds a basic loot table for it)
    .randomTick(tick => {
      const { block, level, random } = tick;
      let blockPos = block.getPos();
      let DIRECTIONS = $Direction.values()

      if (random.nextInt(GROWTH_CHANCE) == 0) {
        let direction = DIRECTIONS[random.nextInt(DIRECTIONS.length)];
        let blockPos2 = blockPos.relative(direction);
        let blockState2 = level.getBlockState(blockPos2);
        let block = null;

        if (blockState2.isAir() || blockState2.is($Blocks.WATER) && blockState2.getFluidState().getAmount() == 8) {
          block = Block.getBlock("kubejs:small_bud");
        } else if (blockState2.is(Block.getBlock("kubejs:small_bud")) && blockState2.getValue($AmethystClusterBlock.FACING) == direction) {
          block = Block.getBlock("kubejs:medium_bud");
        } else if (blockState2.is(Block.getBlock("kubejs:medium_bud")) && blockState2.getValue($AmethystClusterBlock.FACING) == direction) {
          block = Block.getBlock("kubejs:large_bud");
        } else if (blockState2.is(Block.getBlock("kubejs:large_bud")) && blockState2.getValue($AmethystClusterBlock.FACING) == direction) {
          block = Block.getBlock("kubejs:cluster");
        }

        if (block != null) {
          let waterlogged = new $Boolean(blockState2.getFluidState().getType() == $Fluids.WATER);
          let blockState3 = (block.defaultBlockState().setValue($AmethystClusterBlock.FACING, direction))
              .setValue($AmethystClusterBlock.WATERLOGGED, waterlogged);
          level.setBlockAndUpdate(blockPos2, blockState3);
        }
      }
    })
    .tag('minecraft:mineable/pickaxe') // add the block to the tag "minecraft:mineable/pickaxe" so it's faster to mine with a pickaxe

  // register the bud blocks
  event.createCustom("kubejs:small_bud", () => new $AmethystClusterBlock(
    3.0, // height of the AmethystClusterBlock used for collision in pixels
    4.0, // number X, width/length of the AmethystClusterBlock used for collision in pixels = 16 - 2*X
    $BlockBehaviourProperties.of()
      .forceSolidOn() // not sure what this one does, it's on the original buds so I kept it here
      .noOcclusion() // makes it so the block does not cull the faces of blocks around it
      .sound($SoundType.SMALL_AMETHYST_BUD)
      .destroyTime(1.5) // how much time it takes to break (higher = more time, 0 or omit for instant break)
      .explosionResistance(1.5) // explosion resistance (higher = more resistant, 0 or omit for no resistance)
      .lightLevel(blockState => 1) // light level the block emits (the original buds also emit light so I kept it here though you can remove it)
      .pushReaction($PushReaction.DESTROY) // what happens when a piston pushes the block, see https://github.com/Minimaxi28/Minimaxi-s-KubeJS-Things/wiki/1.20.1#pushreaction
  )).tag("minecraft:mineable/pickaxe")

  event.createCustom("kubejs:medium_bud", () => new $AmethystClusterBlock(4.0, 3.0, $BlockBehaviourProperties.of()
    .forceSolidOn().noOcclusion().sound($SoundType.MEDIUM_AMETHYST_BUD).destroyTime(1.5).explosionResistance(1.5).lightLevel(blockState => 2).pushReaction($PushReaction.DESTROY)
  )).tag("minecraft:mineable/pickaxe")

  event.createCustom("kubejs:large_bud", () => new $AmethystClusterBlock(5.0, 3.0, $BlockBehaviourProperties.of()
    .forceSolidOn().noOcclusion().sound($SoundType.LARGE_AMETHYST_BUD).destroyTime(1.5).explosionResistance(1.5).lightLevel(blockState => 4).pushReaction($PushReaction.DESTROY)
  )).tag("minecraft:mineable/pickaxe")
    
  event.createCustom("kubejs:cluster", () => new $AmethystClusterBlock(7.0, 3.0, $BlockBehaviourProperties.of()
    .forceSolidOn().noOcclusion().sound($SoundType.AMETHYST_CLUSTER).destroyTime(1.5).explosionResistance(1.5).lightLevel(blockState => 5).pushReaction($PushReaction.DESTROY)
  )).tag("minecraft:mineable/pickaxe")

  // register the block
  event.create("kubejs:block")
    .hardness(1.5)
    .resistance(1.5)
    .soundType($SoundType.AMETHYST) // sound the block makes, see https://github.com/Minimaxi28/Minimaxi-s-KubeJS-Things/wiki/1.20.1#soundtype
    .requiresTool() // make the block require a tool to break
    .tag('minecraft:mineable/pickaxe') // make the block require a pickaxe to break + better pickaxes will mine it faster
})

// register the items
StartupEvents.registry("item", event => {
  const $BlockItem = Java.loadClass("net.minecraft.world.item.BlockItem")
  const $IProperties = Java.loadClass("net.minecraft.world.item.Item$Properties")

  // register the block items for the buds
  event.createCustom("kubejs:cluster", () => new $BlockItem(Block.getBlock("kubejs:cluster"),new $IProperties()))
  event.createCustom("kubejs:large_bud", () => new $BlockItem(Block.getBlock("kubejs:large_bud"),new $IProperties()))
  event.createCustom("kubejs:medium_bud", () => new $BlockItem(Block.getBlock("kubejs:medium_bud"),new $IProperties()))
  event.createCustom("kubejs:small_bud", () => new $BlockItem(Block.getBlock("kubejs:small_bud"),new $IProperties()))

  // register the shard item
  event.create("kubejs:shard")
})
