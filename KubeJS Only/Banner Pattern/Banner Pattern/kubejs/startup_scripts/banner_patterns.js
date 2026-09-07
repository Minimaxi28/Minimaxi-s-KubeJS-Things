// namespace to be used
// don't change it if you don't know what it is
let namespace = "kubejs"

// list of banner patterns to create
// make sure to add the necessary files everywhere based on the ones provided
// i.e. every file with "infinity" in it's name needs to be duplicated and renamed to your custom one

// make sure to modify the contents of the .json files in kubejs\data\kubejs\tags\banner_pattern\pattern_item and
// kubejs\assets\kubejs\models\item to match the name of your banner pattern, just renaming the files will not suffice.
let banners = [
  "infinity"
]

StartupEvents.registry('banner_pattern', event => {
  let $BannerPattern = Java.loadClass('net.minecraft.world.level.block.entity.BannerPattern')

  banners.forEach(bannerName => {
    event.createCustom(`${namespace}:${bannerName}`, () => new $BannerPattern(bannerName))
  })
})

StartupEvents.registry('item', event => {
  let $BannerPatternItem = Java.loadClass('net.minecraft.world.item.BannerPatternItem')
  let $TagKey = Java.loadClass('net.minecraft.tags.TagKey')
  let $Registries = Java.loadClass('net.minecraft.core.registries.Registries')
  let $ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
  let $Item$Properties = Java.loadClass('net.minecraft.world.item.Item$Properties')

  banners.forEach(bannerName => {
    event.createCustom(`${namespace}:${bannerName}_banner_pattern`, () => new $BannerPatternItem(
      $TagKey.create($Registries.BANNER_PATTERN, new $ResourceLocation.fromNamespaceAndPath(namespace, `pattern_item/${bannerName}`)),
      new $Item$Properties().stacksTo(1)))
      // optionaly, add .rarity($Rarity.COMMON) or .rarity($Rarity.UNCOMMON) or .rarity($Rarity.RARE) or .rarity($Rarity.EPIC) 
      // after .stacksTo(1) to make the the name of the item colored
      // i.e. new $Item$Properties().stacksTo(1).rarity($Rarity.COMMON)
      // you have to add "let $Rarity = Java.loadClass('net.minecraft.world.item.Rarity')" with the other ones
  })
})