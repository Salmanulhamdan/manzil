import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {
    let auth = localStorage.getItem('jwtToken')
    return(
        auth? <Outlet/> : <Navigate to="/"/>
    )
}


const PrivateRoutesAdmin = () => {
    let auth = localStorage.getItem('jwtTokenAdmin')
    return(
        auth? <Outlet/> : <Navigate to="/admin/"/>
    )
}


export { PrivateRoutes,PrivateRoutesAdmin}