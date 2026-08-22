// register the block
StartupEvents.registry('block', event => {
  let $SpongeBlock = Java.loadClass("net.minecraft.world.level.block.SpongeBlock")
  let $BlockPos = Java.loadClass("net.minecraft.core.BlockPos")
  let $Direction = Java.loadClass("net.minecraft.core.Direction")
  let $LiquidBlock = Java.loadClass("net.minecraft.world.level.block.LiquidBlock")
  let playSound = 'playSound(net.minecraft.world.entity.Entity,net.minecraft.core.BlockPos,net.minecraft.sounds.SoundEvent,net.minecraft.sounds.SoundSource,float,float)'
  let $SoundEvents = Java.loadClass("net.minecraft.sounds.SoundEvents")
  let $SoundSource = Java.loadClass("net.minecraft.sounds.SoundSource")
  let $BlockBehaviourProperties = Java.loadClass("net.minecraft.world.level.block.state.BlockBehaviour$Properties")
  let $SoundType = Java.loadClass("net.minecraft.world.level.block.SoundType")

  event.createCustom("kubejs:sponge", () => new JavaAdapter($SpongeBlock, {
    // override tryAbsorbWater to be able to change what happens after things are absorbed
    tryAbsorbWater: function(level, blockPos) {
      if (this.removeWaterBreadthFirstSearch(level, blockPos)) {
        // things here will get executed after the sponge has absorbed something
        // you could remove the if() and just have 'this.removeWaterBreadthFirstSearch(level, blockPos)' if you don't want anything to happen

        // replace the sponge with another block, it can be any block, vanilla or modded
        // it's here that you would for example set a 'kubejs:wet_sponge' (which can just be a normal event.create('kubejs:wet_sponge') block)
        level.setBlock(blockPos, Block.getBlock("minecraft:stone"), 2);

        // play a sound
        // for $SoundEvents, see https://github.com/Minimaxi28/Minimaxi-s-KubeJS-Things/wiki/1.21.1#all-available-soundevents-are-listed-here
        // and https://github.com/Minimaxi28/Minimaxi-s-KubeJS-Things/wiki/1.21.1#custom-soundtype-using-custom-soundevents
        // for $SoundSource, see https://github.com/Minimaxi28/Minimaxi-s-KubeJS-Things/wiki/1.21.1#soundsource
        level[playSound](null, blockPos, $SoundEvents.SPONGE_ABSORB, $SoundSource.BLOCKS, 1.0, 1.0);
      }
    },
    removeWaterBreadthFirstSearch: function(level, blockPos) {
      return $BlockPos.breadthFirstTraversal(
        blockPos,
        6,  // radius (in blocks) around the sponge, the shape is not a cube, it's an octahedron (original = 6)
        65, // max number of blocks to remove before stopping + 1 (because we don't remove the sponge) (original = 65)
        (blockPosx, consumer) => {
          for (let direction of $Direction.values()) {
            consumer.accept(blockPosx.relative(direction));
          }
        },
        blockPos2 => {
          // don't remove the sponge
          if (blockPos2.equals(blockPos)) { return true; }

          let blockState = level.getBlockState(blockPos2);

          // here, blockState is the blockState being checked, you define what happens to it
          // you can remove it, replace it, anything you want
          // see https://github.com/Minimaxi28/Minimaxi-s-KubeJS-Things/blob/1.21.1/KubeJS%20Only/Sponge/README.md for examples

          // i'll put a check for instanceof LiquidBlock so that it makes a universal fluid Sponge
          
          // replace every blocks that are instances of LiquidBlock i.e. every liquid with minecraft:air
          // waterlogged blocks are not LiquidBlock(s) so those won't be removed !
          if (blockState.getBlock() instanceof $LiquidBlock) {
            level.setBlock(blockPos2, Block.getBlock("minecraft:air").defaultBlockState(), 3);
            return true
          }
          
          return false;
        }
      ) > 1;
    }
  },
  $BlockBehaviourProperties.of()
    .strength(0.6) // how much time it takes to break (higher = more time, 0 or omit for instant break)
    .sound($SoundType.SPONGE) // sound the block makes, see https://github.com/Minimaxi28/Minimaxi-s-KubeJS-Things/wiki/1.21.1#soundtype
  ))
  .tag("minecraft:mineable/hoe") // add the block to the tag "minecraft:mineable/hoe" so it's faster to mine with a hoe
})

// register the block item
StartupEvents.registry("item", event => {
  let $BlockItem = Java.loadClass("net.minecraft.world.item.BlockItem")
  let $IProperties = Java.loadClass("net.minecraft.world.item.Item$Properties")

  event.createCustom("kubejs:sponge", () => new $BlockItem(Block.getBlock("kubejs:sponge"), new $IProperties()))
})
