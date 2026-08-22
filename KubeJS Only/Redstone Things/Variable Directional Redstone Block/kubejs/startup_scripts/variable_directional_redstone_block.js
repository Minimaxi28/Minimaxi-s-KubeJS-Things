StartupEvents.registry('block', event => {
  let $NoteBlock = Java.loadClass("net.minecraft.world.level.block.NoteBlock")
  let $BlockBehaviourProperties = Java.loadClass("net.minecraft.world.level.block.state.BlockBehaviour$Properties")
  let $Direction = Java.loadClass("net.minecraft.core.Direction")
  let $InteractionResult = Java.loadClass("net.minecraft.world.InteractionResult")
  let $ItemInteractionResult = Java.loadClass("net.minecraft.world.ItemInteractionResult")
  let $NoteBlockInstrument = Java.loadClass("net.minecraft.world.level.block.state.properties.NoteBlockInstrument")
  let $BlockStateProperties = Java.loadClass("net.minecraft.world.level.block.state.properties.BlockStateProperties")
  let $Integer = Java.loadClass("java.lang.Integer")
  let $SoundType = Java.loadClass("net.minecraft.world.level.block.SoundType")

  // As KubeJS cannot createCustom a block with custom blockStates,
  // I am using NoteBlock to get 25 notes * 23 instruments = 575 blockStates
  // (way too much but I didn't find another block with 2 blockstates that have at least 16 and 6 values).
  // I'm repurposing the first 16 notes (including 0) for the signal strength
  // and the first 6 instruments as the facing direction

  // harp = down, basedrum = up, snare = north, hat = east, bass = south, flute = west
  let FACING_BY_ORDINAL = [$Direction.DOWN, $Direction.UP, $Direction.NORTH, $Direction.EAST, $Direction.SOUTH, $Direction.WEST]

  event.createCustom("kubejs:directional_variable_redstone_block", () => new JavaAdapter($NoteBlock, {
    // overrides to remove the NoteBlock's code
    neighborChanged: function(blockState, level, blockPos, block, blockPos2, bl) {
      return;
    },
    updateShape(blockState, direction, blockState2, levelAccessor, blockPos, blockPos2) {
      return blockState
    },    
    attack(blockState, level, blockPos, player) {
      return;
    },

    // override isSignalSource to make redstone connect to the block
    isSignalSource: function(blockState) {
      return true;
    },

    // override getStateForPlacement to make the block place like a piston
    getStateForPlacement: function(blockPlaceContext) {
      let direction = blockPlaceContext.getNearestLookingDirection().getOpposite();
      let ordinal = FACING_BY_ORDINAL.indexOf(direction);
      let instrument = $NoteBlockInstrument.values()[ordinal];
      return this.defaultBlockState().setValue($BlockStateProperties.NOTEBLOCK_INSTRUMENT, instrument);
    },

    // override useItemOn to only allow right click with empty hand
    useItemOn: function(itemStack, blockState, level, blockPos, player, interactionHand, blockHitResult) {
      if(!itemStack.isEmpty()) {
        return $ItemInteractionResult.CONSUME
      }
      return $ItemInteractionResult.PASS_TO_DEFAULT_BLOCK_INTERACTION;
    },

    // override useWithoutItem to implement the logic of the block
    useWithoutItem: function(blockState, level, blockPos, player, blockHitResult) {
      if(player.isShiftKeyDown()) {
        // if the player is sneaking, cycle the instrument up to flute (6th instrument) then reset to harp (1st instrument)
        if(blockState.getValue($BlockStateProperties.NOTEBLOCK_INSTRUMENT) == $NoteBlockInstrument.FLUTE) {
          level.setBlock(blockPos, blockState.setValue($BlockStateProperties.NOTEBLOCK_INSTRUMENT, $NoteBlockInstrument.HARP), 3)
        } else {
          level.setBlock(blockPos, blockState.cycle($BlockStateProperties.NOTEBLOCK_INSTRUMENT), 3);
        }
      } else {
        // if player is not sneaking, cycle the note up to 15 then reset to 0
        if(blockState.getValue($BlockStateProperties.NOTE) == 15) {
          level.setBlock(blockPos, blockState.setValue($BlockStateProperties.NOTE, new $Integer(0)), 3)
        } else {
          level.setBlock(blockPos, blockState.cycle($BlockStateProperties.NOTE), 3);
        }
      }

      return $InteractionResult.sidedSuccess(level.isClientSide());
    },
    
    // override getSignal to only output in the right direction based on the instrument
    // and output the right signal strength based on the note
    getSignal: function(blockState, blockGetter, blockPos, direction) {
      let ordinal = blockState.getValue($BlockStateProperties.NOTEBLOCK_INSTRUMENT).ordinal();
      return FACING_BY_ORDINAL[ordinal] === direction.getOpposite() ? blockState.getValue($BlockStateProperties.NOTE) : 0;
    }
  },
  $BlockBehaviourProperties.of()
    .isRedstoneConductor((blockState, blockGetter, blockPos) => false) // makes it so redstone cannot power redstone on the other side of the block
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

  event.createCustom("kubejs:directional_variable_redstone_block", () => new $BlockItem(Block.getBlock("kubejs:directional_variable_redstone_block"),new $IProperties()))
})