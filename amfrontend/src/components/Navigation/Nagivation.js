import './navigation.scss';
import React, { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate, useLocation} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { toast } from 'react-toastify';
import logo from '../../static/logo.jpeg';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import account_icon from '../../static/account-icon.png'
import { logoutUser } from '../../services/userService';
import { logout } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';

const Navigation = (props) => {
    let navigate = useNavigate();
    let location = useLocation();
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');


    const handleLogout = async () => {
        try {
            await logoutUser();
            setUsername('');
            toast.success("Đăng xuất thành công!");
            dispatch(logout());
            navigate('/login');
        } catch (err) {
            toast.error("Đăng xuất thất bại!");
            console.log('Logout error:', err);
        }
    };

    if(location.pathname !== '/login'){
    return (
        <>
        <div className="nav-header">
            <Navbar bg="header" expand="lg" className="px-3">
            <Container fluid className="d-flex justify-content-between align-items-center">

                <Navbar.Brand className="img">
                <img
                    src={logo}
                    width="70"
                    height="70"
                    alt="Skylake logo"
                />
                </Navbar.Brand>

                <div className="offcanvas-navheader d-lg-none">
                    <Navbar.Toggle aria-controls="offcanvasNavbar" />
                    <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="end"
                        style={{ width: '220px', maxWidth: '80vw' }}
                    >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="offcanvasNavbarLabel">Skylake</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1 pe-3">
                        <NavLink to="/" exact className="nav-link">Trang chủ</NavLink>
                        <NavLink to="/fee" exact className="nav-link">Khoản phí</NavLink>
                        <NavLink to="/apartments" exact className="nav-link">Căn hộ</NavLink>
                        <NavLink to="/resident" exact className="nav-link">Cư dân</NavLink>
                        <NavLink to="/vehicle" exact className="nav-link">Phương tiện</NavLink>
                        <NavDropdown title="Tài khoản" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.0">Thông tin tài khoản</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.1">Đổi mật khẩu</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item>
                            <span onClick={() => handleLogout()}>Đăng xuất</span>
                            </NavDropdown.Item>
                        </NavDropdown>
                        </Nav>
                    </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </div>

                <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
                <Nav className="me-auto">
                    <NavLink to="/" exact className="nav-link">Trang chủ</NavLink>
                    <NavLink to="/fee" exact className="nav-link">Khoản phí</NavLink>
                    <NavLink to="/apartments" exact className="nav-link">Căn hộ</NavLink>
                    <NavLink to="/resident" exact className="nav-link">Cư dân</NavLink>
                    <NavLink to="/vehicle" exact className="nav-link">Phương tiện</NavLink>
                </Nav>
                <Nav>
                    <h5>{username}</h5>
                    <DropdownButton
                    className="drop-button"
                    align="end"
                    id="dropdown-menu-align-end"
                    title={
                        <img src={account_icon} width="35" height="35" alt="Tài khoản" />
                    }
                    >
                    <Dropdown.Item href="#action/3.0">Thông tin tài khoản</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#action/3.1">Đổi mật khẩu</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>
                        <span onClick={() => handleLogout()}>Đăng xuất</span>
                    </Dropdown.Item>
                    </DropdownButton>
                </Nav>
                </Navbar.Collapse>

            </Container>
            </Navbar>
        </div>
        </>
    )
            
}
}


export default Navigation;