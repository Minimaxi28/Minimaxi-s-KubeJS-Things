# PushReaction

### There are 5 available PushReaction(s)

- `NORMAL` block can be pushed and pulled
- `DESTROY` breaks the block as if it was a player mining it by hand
- `BLOCK` block cannot be pushed and cannot be pulled
- `IGNORE` seems to be just like PUSH_ONLY
- `PUSH_ONLY` block can be pushed but not pulled

---
# SoundType

## All available SoundType(s) are listed [here](https://mcsrc.dev/1/1.21.1/net/minecraft/world/level/block/SoundType)

## Custom SoundType

To make a custom SoundType, you have to do this:

```js
// startup_scripts
const $SoundType = Java.loadClass("net.minecraft.world.level.block.SoundType")
const $SoundEvent = Java.loadClass("net.minecraft.sounds.SoundEvent")
const $ResourceLocation = Java.loadClass("net.minecraft.resources.ResourceLocation")

const CUSTOM_SOUNDTYPE_1 = $SoundEvent.createVariableRangeEvent(
  $ResourceLocation.fromNamespaceAndPath("kubejs", "test.custom_sound.example_1")
)
const CUSTOM_SOUNDTYPE_2 = $SoundEvent.createVariableRangeEvent(
  $ResourceLocation.fromNamespaceAndPath("kubejs", "test.custom_sound.example_2")
)
```

You then put your custom sound(s) (in the .ogg format) in `kubejs\assets\kubejs\sounds`.

You then create a `sounds.json` file in `kubejs\assets\kubejs` which should look like this :

```json
{
  "test.custom_sound.example_1": {
    "sounds": ["kubejs:name_of_file_for_sound_one"]
  },
  "test.custom_sound.example_2": {
    "sounds": [
      "kubejs:sound_one",
      "kubejs:sound_two",
      "kubejs:sound_three"
      ],
    "subtitle": "subtitle.custom_sound.example_2"
  }
}
```

`"sounds"` is an array of ressource locations to files that are in `kubejs\assets\kubejs\sounds`.

`"sounds"` is an array so that one "action" can have multiple sounds that are played randomly.

You can also put the sounds in sub-folders `"sounds": ["kubejs:folder_1/folder_2/sound_file_name"]`.