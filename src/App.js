import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';

console.redirectUnauthorize = (error)=>{
  if (error.response) {
    // console.log(error.response.data);
    // console.log(error.response.status);
    // console.log(error.response.headers);
    console.error(error)
    if(error.response.status === 401){
      window.localStorage.removeItem("token")
      window.location.href = "/login"
    }
  }else{
    console.error(error)
  }
  
}

const App = () => {
  const routing = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
};

export default App;
