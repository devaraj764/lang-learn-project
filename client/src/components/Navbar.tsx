// NavBar.tsx
import React, { useContext } from 'react';
import { Flex, Box, Button, Container, IconButton, Tooltip } from '@chakra-ui/react';
import { FaLanguage } from 'react-icons/fa'
// import { MdOutlineAnalytics } from 'react-icons/md'
import { AiOutlineLogout } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../App';

const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const context = useContext(MyContext);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }
    return (
        <Box borderBottomColor={'gray.300'} borderBottomWidth={'1px'} width={'100vw'}>
            <Container maxW='container.xl'>
                <Flex justify="space-between" alignItems={'center'} py={4}>
                    <Flex>
                        <Button as={Link} to={context?.user.role === 'admin' ? '/admin' : "/"} leftIcon={<FaLanguage size={42} />} variant={'ghost'} fontSize={'18px'} fontWeight='bold'>LangLearn</Button>
                    </Flex>
                    <Flex gap={"1.2em"} alignItems={'center'}>
                        {/* <Tooltip label='Analytics' fontSize='md'>
                            <IconButton
                                aria-label='Analytics'
                                size={'lg'}
                                icon={<MdOutlineAnalytics size="24px" />}
                                isRound={true}
                                as={Link}
                                to='/analytics'
                            />
                        </Tooltip> */}
                        <Tooltip label='Logout' fontSize='md'>
                            <IconButton
                                aria-label='Analytics'
                                colorScheme='red'
                                size={'lg'}
                                icon={<AiOutlineLogout size="24px" />}
                                isRound={true}
                                onClick={handleLogout}
                            />
                        </Tooltip>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};

export default NavBar;
