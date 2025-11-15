import { Button, Container, HStack, Text,  Grid, Box } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
	const token = localStorage.getItem("token");
	const navigate = useNavigate()
	const handleLogOut = () => {
		localStorage.removeItem("token")
		localStorage.removeItem("user")
		navigate("/")
	}

	return (
		<Container maxW={"full"} px={2} py={2} bgColor={'orange.100'} position={"fixed"} zIndex="1000">
			 {/* zIndex="1000" makes sure your navbar always stays visible on top of other content, like forms or product cards that scroll.  */}
			<Grid templateColumns="1fr 1fr" alignItems="center">
				<Box>
					<Text
						fontSize={{ base: "22", sm: "28" }}
						fontWeight={"bold"}
						textTransform={"uppercase"}
						textAlign={"center"}
						bgGradient={"linear(to-r, cyan.400, blue.500)"}
						bgClip={"text"}
					>
						Unique Mart
					</Text>
				</Box>
				<HStack justify="flex-end" spacing={4}>
					{/* <Button colorScheme="teal" >
						<Link to="/"><FaHome /></Link>
					</Button> */}
					{!token && (
						<>
							<Button colorScheme="teal" >
								<Link to="/register">Register</Link>
							</Button>
							<Button colorScheme="teal" >
								<Link to="/login">Login</Link>
							</Button>
						</>
					)}
					{token && (
						<Button colorScheme="teal" onClick={handleLogOut} >
							Logout
						</Button>
					)}
				</HStack>
			</Grid>
		</Container>
	);
};
export default Navbar;
// spacing={4} = 4 units=16 px= 16px( 1 unit = 4px)