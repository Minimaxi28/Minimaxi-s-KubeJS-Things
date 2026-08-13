let $BuddingAmethystBlock = Java.loadClass("net.minecraft.world.level.block.BuddingAmethystBlock")
let $Block = Java.loadClass("net.minecraft.world.level.block.Block")
let $BlockBehaviourProperties = Java.loadClass("net.minecraft.world.level.block.state.BlockBehaviour$Properties")
let $SoundType = Java.loadClass("net.minecraft.world.level.block.SoundType")
let $PushReaction = Java.loadClass("net.minecraft.world.level.material.PushReaction")

let $AmethystClusterBlock = Java.loadClass("net.minecraft.world.level.block.AmethystClusterBlock")
let $Direction = Java.loadClass("net.minecraft.core.Direction")
let $Fluids = Java.loadClass("net.minecraft.world.level.material.Fluids")
let $Boolean = Java.loadClass("java.lang.Boolean")

// register the budding block
StartupEvents.registry('block', event => {
  let DIRECTIONS = $Direction.values()
  // to add another budding block, copy everything between line 16 and line 49 and paste it after line 49
  event.createCustom("kubejs:budding", () => new JavaAdapter($BuddingAmethystBlock, {
    // override the original BuddingAmethystBlock randomTick() with an identical function but use our custom buds instead
    randomTick: function(blockState, serverLevel, blockPos, randomSource) {
      if (randomSource.nextInt(5) == 0) {
        let direction = DIRECTIONS[randomSource.nextInt(DIRECTIONS.length)];
        let blockPos2 = blockPos.relative(direction);
        let blockState2 = serverLevel.getBlockState(blockPos2);
        let block = null;
        // make sure the strings passed to Block.getBlock() match the ids of the buds registered at line 52
        if (this.canClusterGrowAtState(blockState2)) {
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
          serverLevel.setBlockAndUpdate(blockPos2, blockState3);
        }
      }
    }
  }, 
  $BlockBehaviourProperties.of()
    .randomTicks() // make the block recieve random ticks
    .strength(1.5) // breaking speed of the block (higher = slower)
    .sound($SoundType.AMETHYST) // sound the block makes, see https://github.com/Minimaxi28/Minimaxi-s-KubeJS-Things/wiki/1.21.1#soundtype
    .pushReaction($PushReaction.DESTROY) // what happens when a piston pushes the block, see https://github.com/Minimaxi28/Minimaxi-s-KubeJS-Things/wiki/1.21.1#pushreaction
  )).tag("minecraft:mineable/pickaxe")
})

// register the buds
StartupEvents.registry('block', event => {
  event.createCustom("kubejs:small_bud", () => new $AmethystClusterBlock(
    3.0, // height of the AmethystClusterBlock in pixels
    4.0, // number X, width/length of the AmethystClusterBlock in pixels = 16 - 2*X
    $BlockBehaviourProperties.of()
      .forceSolidOn()
      .noOcclusion()
      .sound($SoundType.SMALL_AMETHYST_BUD) // sound the block makes, see https://github.com/Minimaxi28/Minimaxi-s-KubeJS-Things/wiki/1.21.1#soundtype
      .strength(1.5) // breaking speed of the block (higher = slower, omit for instant break)
      .lightLevel(blockState => 1) // light level the block emits (the original buds also emit light so I kept it here though you can remove it)
      .pushReaction($PushReaction.DESTROY) // what happens when a piston pushes the block, see https://github.com/Minimaxi28/Minimaxi-s-KubeJS-Things/wiki/1.21.1#pushreaction
  )).tag("minecraft:mineable/pickaxe") // add the block to the tag "minecraft:mineable/pickaxe" so it's faster to mine with a pickaxe

  event.createCustom("kubejs:medium_bud", () => new $AmethystClusterBlock(4.0, 3.0, $BlockBehaviourProperties.of()
    .forceSolidOn().noOcclusion().sound($SoundType.MEDIUM_AMETHYST_BUD).strength(1.5).lightLevel(blockState => 2).pushReaction($PushReaction.DESTROY)
  )).tag("minecraft:mineable/pickaxe")

  event.createCustom("kubejs:large_bud", () => new $AmethystClusterBlock(5.0, 3.0, $BlockBehaviourProperties.of()
    .forceSolidOn().noOcclusion().sound($SoundType.LARGE_AMETHYST_BUD).strength(1.5).lightLevel(blockState => 4).pushReaction($PushReaction.DESTROY)
  )).tag("minecraft:mineable/pickaxe")
    
  event.createCustom("kubejs:cluster", () => new $AmethystClusterBlock(7.0, 3.0, $BlockBehaviourProperties.of()
    .forceSolidOn().noOcclusion().sound($SoundType.AMETHYST_CLUSTER).strength(1.5).lightLevel(blockState => 5).pushReaction($PushReaction.DESTROY)
  )).tag("minecraft:mineable/pickaxe")
})

let $BlockItem = Java.loadClass("net.minecraft.world.item.BlockItem")
let $IProperties = Java.loadClass("net.minecraft.world.item.Item$Properties")

// register the block items for the budding block and the buds
StartupEvents.registry("item", event => {
  event.createCustom("kubejs:budding", () => new $BlockItem(Block.getBlock("kubejs:budding"),new $IProperties()))
  event.createCustom("kubejs:cluster", () => new $BlockItem(Block.getBlock("kubejs:cluster"),new $IProperties()))
  event.createCustom("kubejs:large_bud", () => new $BlockItem(Block.getBlock("kubejs:large_bud"),new $IProperties()))
  event.createCustom("kubejs:medium_bud", () => new $BlockItem(Block.getBlock("kubejs:medium_bud"),new $IProperties()))
  event.createCustom("kubejs:small_bud", () => new $BlockItem(Block.getBlock("kubejs:small_bud"),new $IProperties()))
})

// register the shard item
StartupEvents.registry("item", event => {
  event.create("kubejs:shard")
})

// register the block
StartupEvents.registry("block", event => {
  event.create("kubejs:block")
    .hardness(1.5) // mining speed
    .resistance(1.5) // explosion resistance
    .soundType($SoundType.AMETHYST) // sound the block makes, see https://github.com/Minimaxi28/Minimaxi-s-KubeJS-Things/wiki/1.21.1#soundtype
    .requiresTool() // make the block require a tool to break
    .tag('minecraft:mineable/pickaxe') // make the block require a pickaxe to break + better pickaxes will mine it faster
})
