### `Sponge` adds a custom Sponge block that will absorb every fluid but can be configured to absorb anything you want (see below). 

[Video showcase](https://www.youtube.com/watch?v=GMzQVETU62A)

## Examples of configuration

### Replace every block with `minecraft:air`.

Don't remove Bedrock because well it's bedrock and don't remove air otherwise it will remove less blocks then expected.

```java
blockPos2 => {
  if (blockPos2.equals(blockPos)) { return true; }

  let blockState = level.getBlockState(blockPos2);

  if(blockState.getBlock() == Block.getBlock("minecraft:bedrock") || 
  blockState.getBlock() == Block.getBlock("minecraft:air")) { return false }

  level.setBlock(blockPos2, Block.getBlock("minecraft:air").defaultBlockState(), 3);
  return true;
}
```

---

### Replace every blocks that are instances of the RotatedPillarBlock class with `minecraft:air` (logs, woods, pillars, hyphaes,...).

You need `let $RotatedPillarBlock = Java.loadClass("net.minecraft.world.level.block.RotatedPillarBlock")` at the top of the script with the other ones.

```java
blockPos2 => {
  if (blockPos2.equals(blockPos)) { return true; }

  let blockState = level.getBlockState(blockPos2);

  if (blockState.getBlock() instanceof $RotatedPillarBlock) {
    level.setBlock(blockPos2, Block.getBlock("minecraft:air").defaultBlockState(), 3);
    return true
  }

  return false
}
```

---

### Remove the water from waterlogged blocks (that's how the vanilla sponge does it).

You need `let $BucketPickup = Java.loadClass("net.minecraft.world.level.block.BucketPickup")` at the top of the script with the other ones.

```java
blockPos2 => {
  if (blockPos2.equals(blockPos)) { return true; }

  let blockState = level.getBlockState(blockPos2);

  if (blockState.getBlock() instanceof $BucketPickup) {
    let stack = blockState.getBlock().pickupBlock(null, level, blockPos2, blockState)
    if (!stack.isEmpty()) {
      return true
    }
  }

  return false
}
```

---

### Turn off the normal campfires by modyfing their blockstate.

You need `let $BlockStateProperties = Java.loadClass("net.minecraft.world.level.block.state.properties.BlockStateProperties")` at the top of the script with the other ones.

You need `let $Boolean = Java.loadClass("java.lang.Boolean")` at the top of the script with the other ones.

```java
blockPos2 => {
  if (blockPos2.equals(blockPos)) { return true; }

  let blockState = level.getBlockState(blockPos2);

  if (blockState.getBlock() == Block.getBlock("minecraft:campfire")) {
    if(blockState.getValue($BlockStateProperties.LIT)) {
      level.setBlock(blockPos2, blockState.setValue($BlockStateProperties.LIT, new $Boolean(0)), 3);
      return true
    }
  }

  return false
}
```

---

### Adding this before `return true` will make the blocks absorbed drop themselves as if they were broken with their respective non-enchanted tool.

```java
let blockEntity = blockState.hasBlockEntity() ? level.getBlockEntity(blockPos2) : null;
this.dropResources(blockState, level, blockPos2, blockEntity);
level.setBlock(blockPos2, Block.getBlock("minecraft:air").defaultBlockState(), 3);
```

---

### Replace all blocks that are instances of the Block class but not blocks that are instances of the LiquidBlock class with `minecraft:air` and blocks replaced will drop as items as if they were broken with their respective non-enchanted tool.

You need `let $Block = Java.loadClass("net.minecraft.world.level.block.Block")` at the top of the script with the other ones.

```java
blockPos2 => {
  if (blockPos2.equals(blockPos)) { return true; }

  let blockState = level.getBlockState(blockPos2);

  if(blockState.getBlock() == Block.getBlock("minecraft:bedrock") || 
  blockState.getBlock() == Block.getBlock("minecraft:air")) { return false }
  if (blockState.getBlock() instanceof $Block && !(blockState.getBlock() instanceof $LiquidBlock)) {
    let blockEntity = blockState.hasBlockEntity() ? level.getBlockEntity(blockPos2) : null;
    this.dropResources(blockState, level, blockPos2, blockEntity);
    level.setBlock(blockPos2, Block.getBlock("minecraft:air").defaultBlockState(), 3);
    return true
  }

  return false
}
```