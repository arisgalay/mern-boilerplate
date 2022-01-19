import { useState } from 'react'
import SideDrawer from './SideDrawer'
import MainHeader from './MainHeader'
import NavLinks from './NavLinks'
import BackDrop from '../UIElements/BackDrop'
import { Link } from 'react-router-dom'
import './mainnavigation.css'

const MainNavigation = () => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false)
    const drawerToggle = () => {
        setDrawerIsOpen(!drawerIsOpen)
    }
    return (
        <>
            {drawerIsOpen && <BackDrop onClick={drawerToggle} />}
            <SideDrawer show={drawerIsOpen} drawerToggle={drawerToggle}>
                <nav className="main-navigation__drawer-nav">
                    <NavLinks />
                </nav>
            </SideDrawer>
            <MainHeader>
                <button
                    className="main-navigation__menu-btn"
                    onClick={drawerToggle}
                >
                    <span />
                    <span />
                    <span />
                </button>
                <h1 className="main-navigation__title">
                    <Link to="/">Your Places</Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>
            </MainHeader>
        </>
    )
}

export default MainNavigation
