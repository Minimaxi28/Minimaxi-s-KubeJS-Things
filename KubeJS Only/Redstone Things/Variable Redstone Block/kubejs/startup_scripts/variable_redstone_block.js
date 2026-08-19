// register the block
StartupEvents.registry('block', event => {
  let $SugarCaneBlock = Java.loadClass("net.minecraft.world.level.block.SugarCaneBlock")
  let $Block = Java.loadClass("net.minecraft.world.level.block.Block")
  let $ItemInteractionResult = Java.loadClass("net.minecraft.world.ItemInteractionResult")
  let $Integer = Java.loadClass("java.lang.Integer")
  let $InteractionResult = Java.loadClass("net.minecraft.world.InteractionResult")
  let $BlockStateProperties = Java.loadClass("net.minecraft.world.level.block.state.properties.BlockStateProperties")
  let $BlockBehaviourProperties = Java.loadClass("net.minecraft.world.level.block.state.BlockBehaviour$Properties")

  // As KubeJS cannot createCustom a block with custom blockStates,
  // I am using SugarCaneBlock to get 16 block states (AGE_15),
  // see https://mcsrc.dev/1/1.21.1/net/minecraft/world/level/block/SugarCaneBlock
  event.createCustom("kubejs:variable_redstone_block", () => new JavaAdapter($SugarCaneBlock, {
    // override getShape to a full block
    getShape: (blockState, blockGetter, blockPos, collisionContext) => {
      return $Block.box(0, 0, 0, 16, 16, 16)
    },
    
    // override canSurvive so it can be placed anywhere
    canSurvive: function(blockState, levelReader, blockPos) {
      return true;
    },

    // override useItemOn to only allow right click with empty hand
    useItemOn(itemStack, blockState, level, blockPos, player, interactionHand, blockHitResult) {
      if(!itemStack.isEmpty()) {
        return $ItemInteractionResult.CONSUME
      }
      return $ItemInteractionResult.PASS_TO_DEFAULT_BLOCK_INTERACTION;
    },

    // override useWithoutItem to implement the logic of the block
    useWithoutItem: function(blockState, level, blockPos, player, blockHitResult) {
      if(player.isShiftKeyDown()) {
        // make it so sneak + right click cycles backwards
        let age = blockState.getValue($BlockStateProperties.AGE_15);
        let newAge = age == 0 ? 15 : age - 1;

        level.setBlock(
          blockPos,
          blockState.setValue($BlockStateProperties.AGE_15, new $Integer(newAge)),
          3
        );
      } else {
        // cycle forwards
        level.setBlock(blockPos, blockState.cycle($BlockStateProperties.AGE_15), 3);
      }

      return $InteractionResult.sidedSuccess(level.isClientSide());
    },

    // override getSignal to make it output a redstone signal based on the AGE block state
    getSignal: function(blockState, blockGetter, blockPos, direction) {
      return blockState.getValue($BlockStateProperties.AGE_15);
    },

    // override isSignalSource to make redstone connect to the block
    isSignalSource: function(blockState) {
      return true;
    }
  },
  $BlockBehaviourProperties.of()
    .requiresCorrectToolForDrops() // make the block require a tool to break
    .strength(5.0) // how much time it takes to break (higher = more time, 0 or omit for instant break)
    .explosionResistance(5.0) // explosion resistance (higher = more resistant, 0 or omit for no resistance)
    .sound($SoundType.METAL) // sound the block makes, see https://github.com/Minimaxi28/Minimaxi-s-KubeJS-Things/wiki/1.21.1#soundtype
  ))
  .tag('minecraft:mineable/pickaxe') // add the block to the tag "minecraft:mineable/pickaxe" so it's faster to mine with a pickaxe
})

// register the block item
StartupEvents.registry("item", event => {
  let $BlockItem = Java.loadClass("net.minecraft.world.item.BlockItem")
  let $IProperties = Java.loadClass("net.minecraft.world.item.Item$Properties")

  event.createCustom("kubejs:variable_redstone_block", () => new $BlockItem(Block.getBlock("kubejs:variable_redstone_block"),new $IProperties()))
})
