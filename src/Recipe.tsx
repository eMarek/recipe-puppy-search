import React from 'react'
import { TRecipeProps } from './Recipe.types'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info'
import { useRecipeStyles } from './Recipe.styles'

function Recipe(props: TRecipeProps) {
  const { recipe } = props
  const classes = useRecipeStyles()
  return (
    <GridListTile className={classes.recipe}>
      <img src={recipe.thumbnail || 'recipe.png'} alt={recipe.title} />
      <GridListTileBar
        title={recipe.title}
        subtitle={<span>{recipe.ingredients}</span>}
        actionIcon={
          <IconButton href={recipe.href}>
            <InfoIcon />
          </IconButton>
        }
      />
    </GridListTile>
  )
}

export default Recipe
