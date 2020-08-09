import React, { useState, ChangeEvent } from 'react'
import { debounce } from 'lodash'
import Recipes from './Recipes'
import './App.css'
import { useAppStyles } from './App.styles'
import { TextField } from '@material-ui/core'
import ChipInput from 'material-ui-chip-input'
import { useCookies } from 'react-cookie'

function App() {
  const [cookies, setCookie] = useCookies()
  const [search, setSearch] = useState<string>(cookies.search)
  const [ingredients, setIngredients] = useState<string>(cookies.ingredients)

  const handleSearchRegular = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value
    handleSearchDebounced(searchValue)
  }

  const handleSearchDebounced = debounce((search: string) => {
    setSearch(search)
    setCookie('search', search)
  }, 500)

  const handleIngredientsChips = (ingredientsValue: Array<string>) => {
    const ingredients = ingredientsValue.map((ingredient) => ingredient.trim()).join(',')
    setIngredients(ingredients)
    setCookie('ingredients', ingredients)
  }

  const classes = useAppStyles()

  return (
    <div>
      <div className={classes.topbar}>
        <div className={classes.fixedWidth}>
          <TextField
            defaultValue={search}
            id="outlined-basic"
            label="Search"
            variant="outlined"
            fullWidth
            onChange={handleSearchRegular}
            className={classes.search}
          />
          <div className={classes.ingredients}>
            <ChipInput
              defaultValue={cookies.ingredients ? cookies.ingredients.split(',') : null}
              fullWidth
              fullWidthInput
              onChange={handleIngredientsChips}
              placeholder="Ingredient"
            />
          </div>
        </div>
      </div>
      <div className={classes.fixedWidth}>
        <div className={classes.recipes}>
          <Recipes search={search} ingredients={ingredients} />
        </div>
      </div>
    </div>
  )
}

export default App
