import { Badge, Card, Grid, GridItem, HStack, Heading, Select, Spacer, Stack, Tag, Text, useToast } from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import { useMutation } from 'react-query';
import { fetchLanguageDetails } from '../api/questions';
import millisecondsToTime from '../helpers/convertMilliSecondsToTime';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import { MyContext } from '../App';


const LeaderBoard = ({ languages }: { languages: string[] }) => {
    const [langSelected, setLangSelected] = useState<string>(localStorage.getItem('langSelected') || languages[0]);
    const [results, setResults] = useState([])
    const toast = useToast();
    const context = useContext(MyContext);

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get('page') || '1');

    // Assuming you have a list of questions
    const perPage = 15; // Adjust as needed

    // Calculate the range of questions to display
    const indexOfLastItem = currentPage * perPage;
    const indexOfFirstItem = indexOfLastItem - perPage;
    const currentResults: any = results.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page: number) => {
        queryParams.set('page', page.toString());
        navigate(`./?${queryParams.toString()}`);
    };

    const langDetailsMutation = useMutation({
        mutationFn: () => fetchLanguageDetails(langSelected),
        onSuccess: (data:any) => {
            setResults(data?.testResults || []);
        },
        onError: (error: any) => {
            toast({
                title: 'Error retriving leader board',
                description: error.response.data.error,
                status: 'error',
                duration: 5000, // Duration for which the toast is displayed (in milliseconds)
                isClosable: true, // Allow the user to close the toast
            });
        }
    });

    useEffect(() => {
        if (langSelected) {
            langDetailsMutation.mutate()
            localStorage.setItem('langSelected', langSelected)
        }
    }, [langSelected])

    const handleChange = (event: any) => {
        setLangSelected(event.target.value)
    }

    return (
        <>
            <HStack justifyContent={'space-between'}>
                {/* <Stack> */}
                <Heading as="h2" my={4} color={'teal'} m={0}>
                    Leader Board
                </Heading>
                {/* <Badge fontSize={'16px'} colorScheme='purple' w="fit-content">Language: {langSelected}</Badge> */}
                {/* </Stack> */}
                <Select m={0} bg={'blackAlpha.100'} defaultValue={langSelected} w='fit-content' minW={'150px'} textTransform={'capitalize'} onChange={handleChange}>
                    {
                        languages.map(language => (
                            <option key={language} value={language} style={{ textTransform: 'capitalize' }}> {language}</option>
                        ))
                    }
                </Select>
            </HStack >
            {
                langDetailsMutation.isLoading ? 'Loading' : currentResults.length <= 0 ?
                    <HStack my={5}>
                        <Tag fontSize={'20px'}>No Results Found</Tag>
                    </HStack>
                    :
                    <>
                        <Spacer height={'2em'} />
                        {
                            context?.user.role === 'user' &&
                            <Tag mb={3} colorScheme='teal' size="lg">Your Rank is #{currentResults.findIndex((item: any) => item.user.email === context?.user.email) + 1}</Tag>
                        }
                        <Grid
                            display="grid"
                            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                            gap={4}
                            minW="360px"
                            mb={'2em'}
                        >
                            {/* Your grid items go here */}
                            {currentResults?.map((item: any, index: number) => (
                                <GridItem key={index}>
                                    <Card p={3} variant={item.user.email === context?.user.email ? 'filled' : 'outline'}>
                                        <HStack w="100%" justifyContent={'space-between'}>
                                            <Stack padding={0} gap={0}>
                                                <Text fontSize="18px" fontWeight="bold">{item.user.name}</Text>
                                                <Text fontSize="14px" colorScheme='gray.100'>{item.user.email}</Text>
                                            </Stack>
                                            <Badge colorScheme='facebook' fontSize={'1em'} >#{index + 1} Rank</Badge>
                                        </HStack>
                                        <HStack mt={3} gap='10px'>
                                            <Tag>Score: {item.score}</Tag>
                                            <Tag>Completion Time: {millisecondsToTime(item.completionTime)}</Tag>
                                        </HStack>
                                    </Card>
                                </GridItem>
                            ))}
                        </Grid>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(results.length / perPage)}
                            onPageChange={handlePageChange}
                        />
                    </>
            }
        </>
    )
}

export default LeaderBoard