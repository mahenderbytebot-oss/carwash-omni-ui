import React from 'react';
import { Route, Redirect, type RouteProps } from 'react-router-dom';
import { useAuthStore, type UserRole } from '../../store/authStore';

interface RoleRouteProps extends RouteProps {
  roles: UserRole[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ roles, component: Component, ...rest }) => {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated || !user) {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          );
        }

        if (roles && !roles.includes(user.role)) {
          console.warn(`Unauthorized access: User role ${user.role} not in allowed roles: ${roles.join(', ')}`);
          return <Redirect to="/unauthorized" />;
        }

        return Component ? <Component {...props} /> : null;
      }}
    />
  );
};
