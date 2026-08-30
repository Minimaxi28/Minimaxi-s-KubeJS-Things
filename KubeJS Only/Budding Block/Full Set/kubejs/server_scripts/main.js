// this script does the same thing as kubejs\data\kubejs\recipe\block.json
// use only one of them otherwise it will add 2 recipes
ServerEvents.recipes(event => {
  event.shaped(
    Item.of('kubejs:block', 1), // arg 1: output
    [
      'AA ',
      'AA ', // arg 2: the shape (array of strings)
      '   '
    ],
    {
      A: 'kubejs:shard' //arg 3: the mapping object
    }
  )
})