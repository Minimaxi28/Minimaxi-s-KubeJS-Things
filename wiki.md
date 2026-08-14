# PushReaction

### There are 5 available PushReaction(s)

- `NORMAL` block can be pushed and pulled
- `DESTROY` breaks the block as if it was a player mining it by hand
- `BLOCK` block cannot be pushed and cannot be pulled
- `IGNORE` seems to be just like PUSH_ONLY
- `PUSH_ONLY` block can be pushed but not pulled

---
# SoundType

## All available SoundType(s) are listed [here](https://mcsrc.dev/1/1.20.1/net/minecraft/world/level/block/SoundType)

## All available SoundEvent(s) are listed [here](https://mcsrc.dev/1/1.20.1/net/minecraft/sounds/SoundEvents)

### Custom SoundType using already existing SoundEvent(s)

```js
// startup_scripts
const $SoundType = Java.loadClass("net.minecraft.world.level.block.SoundType")
const $SoundEvents = Java.loadClass("net.minecraft.sounds.SoundEvents")

const CUSTOM_SOUNDTYPE = new $SoundType(
  1.0, // volume
  1.0, // pitch
  $SoundEvents.SOUND_EVENT_1, // block broken sound
  $SoundEvents.SOUND_EVENT_2, // block stepped on sound
  $SoundEvents.SOUND_EVENT_3, // block placed sound
  $SoundEvents.SOUND_EVENT_4, // block hit sound
  $SoundEvents.SOUND_EVENT_5  // block fallen on sound
)
// Replace `SOUND_EVENT_X` with any existing SoundEvent (https://mcsrc.dev/1/1.20.1/net/minecraft/sounds/SoundEvents).
// You can use the same SoundEvent for all of them if you want, they don't have to be different

// To use, replace anywhere in a script where it's written `$SoundType.XXX` with `CUSTOM_SOUNDTYPE`
// (you replace the whole thing, not just the `XXX`)

// You can also use sounds added by mods, you just have to Java.loadClass the class that contains the sounds
// (usually called ModSounds.java but could be called anything, you have to look at the source code of the mod you want the sounds from) 
```

### Custom SoundType using custom SoundEvent(s)

```js
// startup_scripts
const $SoundType = Java.loadClass("net.minecraft.world.level.block.SoundType")
const $SoundEvent = Java.loadClass("net.minecraft.sounds.SoundEvent")
const $ResourceLocation = Java.loadClass("net.minecraft.resources.ResourceLocation")

const CUSTOM_EVENT_1 = $SoundEvent.createVariableRangeEvent(
  $ResourceLocation.fromNamespaceAndPath("kubejs", "test.custom_sound.example_1")
)
const CUSTOM_EVENT_2 = $SoundEvent.createVariableRangeEvent(
  $ResourceLocation.fromNamespaceAndPath("kubejs", "test.custom_sound.example_2")
)

// more custom events here

const CUSTOM_SOUNDTYPE = new $SoundType(
  1.0, // volume
  1.0, // pitch
  CUSTOM_EVENT_1, // block broken sound
  CUSTOM_EVENT_2, // block stepped on sound
  CUSTOM_EVENT_X, // block placed sound
  CUSTOM_EVENT_Y, // block hit sound
  CUSTOM_EVENT_Z  // block fallen on sound
)
// You can use the same SoundEvent for all of them if you want, they don't have to be different

// To use, replace anywhere in a script where it's written `$SoundType.XXX` with `CUSTOM_SOUNDTYPE`
// (you replace the whole thing, not just the `XXX`)
```
You can also mix with already existing SoundEvent(s), see [Custom SoundType using already existing SoundEvent(s)](https://github.com/Minimaxi28/Minimaxi-s-KubeJS-Things/wiki/1.20.1#custom-soundtype-using-already-existing-soundevents)


You then put your custom sound(s) (in the `.ogg` format) in `kubejs\assets\kubejs\sounds` (can also be in sub-folders).

You then create a `sounds.json` file in `kubejs\assets\kubejs` which should something look like this :

```json
{
  "test.custom_sound.example_1": {
    "sounds": ["kubejs:name_of_file_for_sound_one"]
  },
  "test.custom_sound.example_2": {
    "sounds": [
        {
          "name": "kubejs:sound_one",
          "volume": 0.4,
          "weight": 3
        },
        {
          "name": "kubejs:sound_two",
          "volume": 0.4,
          "weight": 3
        }
      ],
    "subtitle": "subtitle.custom_sound.example_2"
  }
}
```

`"sounds"` is an array of the names of the files that are in `kubejs\assets\kubejs\sounds` omitting the `.ogg`.

`"sounds"` is an array so that one Event (breaking, placing, ...) can have multiple sounds that are played.

The objects in the `"sounds"` array can contain many different things, see the [Minecraft Wiki](https://minecraft.wiki/w/Sounds.json) which lists them all. Also see the [Minecraft Assets Explorer website](https://mcasset.cloud/1.20.1/assets/minecraft/sounds.json) which hosts the `sounds.json` file used by Minecraft.

Don't forget to put the full path to the `.ogg` file if you put it in a sub-folder `"sounds": ["kubejs:folder_1/folder_2/sound_file_name"]` (file path would be `kubejs/assets/kubejs/sounds/folder_1/folder_2/sound_file_name.ogg`).