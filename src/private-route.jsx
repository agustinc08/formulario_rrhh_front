const AUTH_TOKEN_KEY = 'isLoggedIn';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = localStorage.getItem(AUTH_TOKEN_KEY) === 'true';
  const rol = localStorage.getItem("rol");

  const hasAccess = rol === "dependencia" || rol === "admin" || rol === "usuario";

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn && hasAccess ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          >
            <div>Please log in to access this page.</div>
          </Redirect>
        )
      }
    />
  );
};