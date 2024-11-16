import React, { createContext, useContext } from 'react';

const _appContext = createContext();
export const getContext = () => useContext(_appContext);
export function AppContext({ children }) {
    const [state, _setState] = React.useState({})
    const context = {
        state,
        setState: (newState) => {
            _setState(prevState => ({ ...prevState, ...newState }))
        }
    }
    return (
        <_appContext.Provider value={context}>
            {children}
        </_appContext.Provider>
    )
}