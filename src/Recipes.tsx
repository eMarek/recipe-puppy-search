import React, { useState, useEffect, useCallback, Fragment, useRef } from 'react'
import { TRecipesProps } from './Recipes.types'
import { TRecipe } from './Recipe.types'
import Recipe from './Recipe'
import InfiniteScroll from 'react-infinite-scroller'
import GridList from '@material-ui/core/GridList'
import { CircularProgress } from '@material-ui/core'
import { useRecipesStyles } from './Recipes.styles'
import { delay } from 'lodash'

const baseEndpoint = 'http://www.recipepuppy.com/api/'
const proxy = 'http://localhost:8080/'

let recipesStorage: Array<TRecipe> = JSON.parse(localStorage.getItem('recipes') || '[]')
let pageStorage: number = parseInt((recipesStorage.length && localStorage.getItem('page')) || '0')

function Recipes(props: TRecipesProps) {
  const { search, ingredients } = props
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [recipes, setRecipes] = useState<Array<TRecipe>>(recipesStorage)
  const [pageStart, setPageStart] = useState<number | null>(pageStorage)
  const isInitialMount = useRef(true)

  const updateState = useCallback((hasMoreUpdate: boolean, pageNumberUpdate: number, recipesStorageUpdate: Array<TRecipe>) => {
    setHasMore(hasMoreUpdate)
    recipesStorage = recipesStorageUpdate
    localStorage.setItem('recipes', JSON.stringify(recipesStorageUpdate))
    setRecipes(recipesStorageUpdate)
    pageStorage = pageNumberUpdate
    localStorage.setItem('page', String(pageNumberUpdate))
    setPageStart(pageNumberUpdate)
  }, [])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      setPageStart(null)
      delay(() => updateState(true, 0, []), 1)
    }
  }, [search, ingredients, updateState])

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
        updateState(Boolean(data.results.length), pageNumber, [...recipesStorage, ...data.results])
        if (!recipesStorage.length && !data.results.length) {
          setError('Nothing found!')
        }
      } catch (error) {
        setHasMore(false)
        setError('Could not fetch!')
      }
    },
    [getUrl, updateState]
  )

  const classes = useRecipesStyles()

  if (!search && !ingredients) {
    return <div className={classes.text}>Type something in order to search recipes.</div>
  }
  if (pageStart === null) {
    return null
  }
  return (
    <Fragment>
      <InfiniteScroll
        key={`${search}-${ingredients}`}
        pageStart={pageStart}
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
