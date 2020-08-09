import { makeStyles } from '@material-ui/core/styles'

export const useAppStyles = makeStyles({
  topbar: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 100,
    paddingTop: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(0,0,0,0.3)'
  },
  fixedWidth: {
    paddingLeft: '20px',
    paddingRight: '20px',
    boxSizing: 'border-box',
    margin: '0 auto',
    maxWidth: '900px',
    width: '100%'
  },
  search: {
    backgroundColor: 'white'
  },
  ingredients: {
    marginTop: '10px'
  },
  recipes: {
    paddingTop: '150px'
  }
})
