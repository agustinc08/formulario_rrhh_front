const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = sessionStorage.getItem(AUTH_TOKEN_KEY) === 'true';
  const rol = sessionStorage.getItem("rol");

  const hasAccess = rol === "dependencia" || rol === "admin";

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