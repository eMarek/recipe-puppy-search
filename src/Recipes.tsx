import React, { useState, useEffect, useCallback, Fragment } from 'react'
import { TRecipesProps } from './Recipes.types'
import { TRecipe } from './Recipe.types'
import Recipe from './Recipe'
import InfiniteScroll from 'react-infinite-scroller'
import GridList from '@material-ui/core/GridList'
import { CircularProgress } from '@material-ui/core'
import { useRecipesStyles } from './Recipes.styles'

const baseEndpoint = 'http://www.recipepuppy.com/api/'
const proxy = 'http://localhost:8080/'
let recipesResults: Array<TRecipe> = []

function Recipes(props: TRecipesProps) {
  const { search, ingredients } = props
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [recipes, setRecipes] = useState<Array<TRecipe>>([])

  useEffect(() => {
    setHasMore(true)
    recipesResults = []
    setRecipes(recipesResults)
  }, [search, ingredients])

  const getUrl = useCallback(
    (pageNumber: number): string => {
      let url = `${proxy}${baseEndpoint}?p=${pageNumber}`
      url = search ? `${url}&q=${search}` : url
      url = ingredients ? `${url}&i=${ingredients}` : url
      return url
    },
    [search, ingredients]
  )

  const loadMore = useCallback(
    async (pageNumber: number) => {
      setError(null)
      const url = getUrl(pageNumber)
      try {
        const response = await fetch(url)
        const data = await response.json()
        setHasMore(Boolean(data.results.length))
        recipesResults = [...recipesResults, ...data.results]
        setRecipes(recipesResults)
        if (!recipesResults.length && !data.results.length) {
          setError('Nothing found!')
        }
      } catch (error) {
        setHasMore(false)
        setError('Could not fetch!')
      }
    },
    [getUrl]
  )

  const classes = useRecipesStyles()

  if (!search && !ingredients) {
    return <div className={classes.text}>Type something in order to search recipes.</div>
  }

  return (
    <Fragment>
      <InfiniteScroll
        key={`${search}-${ingredients}`}
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMore}
        loader={<CircularProgress key="recipes-loader" className={classes.text} />}
      >
        <GridList key="recipes-grid-list">
          {recipes.map((recipe: TRecipe, recipeIndex: number) => (
            <Recipe key={`${recipe.title}-${recipeIndex}`} recipe={recipe} />
          ))}
        </GridList>
      </InfiniteScroll>
      <div key="recipes-error" className={classes.text}>
        {error}
      </div>
    </Fragment>
  )
}

export default Recipes
