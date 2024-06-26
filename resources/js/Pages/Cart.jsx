import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import {
    Box,
    Heading,
    Table,
    Tbody,
    Tr,
    Td,
    Button,
    Text,
    Checkbox,
    Image,
    Flex,
    useColorModeValue,
    ChakraProvider,
    Wrap,
} from "@chakra-ui/react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import QuantitySelector from "./Item/partials/QuantitySelector";
import { InertiaLink } from "@inertiajs/inertia-react";
import FlashMessageHandler from "./FlashMessageHandler";

const Cart = ({ auth }) => {
    const { props } = usePage();
    const { carts } = props || [];
    const [totalPrice, setTotalPrice] = useState(0);
    const [checkedItems, setCheckedItems] = useState([]);
    const [updatedQuantities, setUpdatedQuantities] = useState({});

    const handleRemove = (itemId) => {
        const cartItem = carts.find((item) => item.id === itemId);
        Inertia.delete(`/cart/${itemId}`, {
            data: { quantity: cartItem.quantity },
        });
    };

    const handleCheckboxChange = (itemId) => {
        setCheckedItems((prevCheckedItems) =>
            prevCheckedItems.find((item) => item.id === itemId)
                ? prevCheckedItems.filter((item) => item.id !== itemId)
                : [
                      ...prevCheckedItems,
                      {
                          id: itemId,
                          quantity: carts.find((cart) => cart.id === itemId)
                              .quantity,
                      },
                  ]
        );
    };

    useEffect(() => {
        let total = 0;
        carts.forEach((cart) => {
            const quantity =
                updatedQuantities[cart.id] ?? cart.quantity;
            if (checkedItems.find((item) => item.id === cart.id)) {
                total += parseFloat(cart.item.price) * quantity;
            }
        });
        setTotalPrice(total);
    }, [checkedItems, carts, updatedQuantities]);

    const handleQuantityChange = (itemId, newQuantity) => {
        setUpdatedQuantities((prevState) => ({
            ...prevState,
            [itemId]: newQuantity,
        }));
        // Update the quantity in checkedItems
        setCheckedItems((prevCheckedItems) =>
            prevCheckedItems.map((item) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <ChakraProvider>
            <FlashMessageHandler>
                <AuthenticatedLayout
                    user={auth.user}
                    header={
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Cart
                        </h2>
                    }
                >
                    <Head title={props.title} />
                    <Box
                        bg={useColorModeValue("rgba(253, 201, 152, 1)")}
                        minH="100vh"
                        id="random-background-box"
                        bgImage={`url(/storage/logo/image.png)`}
                        bgSize="250px"
                        justify="center"
                        align="center"
                        p={5}
                    >
                        <Box
                            bg="bisque"
                            borderRadius="45px"
                            p={5}
                            w="full"
                            maxW="1200px"
                        >
                            <Heading
                                fontSize="60px"
                                fontWeight="bold"
                                align="center"
                                color="rgba(133, 81, 33, 0.8)"
                            >
                                My Cart
                            </Heading>
                            <Wrap justify="flex-start" spacing="30px">
                                {carts.length > 0 ? (
                                    <Table variant="striped" colorScheme="">
                                        <Tbody>
                                            {carts.map((cart) => (
                                                <Tr key={cart.id}>
                                                    <Td>
                                                        <Flex alignItems="center">
                                                            <Checkbox
                                                                mr={4}
                                                                sx={{
                                                                    "& .chakra-checkbox__control": {
                                                                        borderColor: "rgba(133, 81, 33, 0.8)",
                                                                    },
                                                                    "& .chakra-checkbox__control[data-checked]": {
                                                                        borderColor: "rgba(133, 81, 33, 0.8)",
                                                                    },
                                                                    "& .chakra-checkbox__control:hover": {
                                                                        bg: "rgba(133, 81, 33, 0.8)",
                                                                        borderColor: "rgba(133, 81, 33, 0.8)",
                                                                    },
                                                                }}
                                                                isChecked={checkedItems.some(
                                                                    (item) =>
                                                                        item.id ===
                                                                        cart.id
                                                                )}
                                                                onChange={() =>
                                                                    handleCheckboxChange(
                                                                        cart.id
                                                                    )
                                                                }
                                                            />
                                                            <Image
                                                                src={`/storage/${cart.item.image}`}
                                                                alt="wishlist item"
                                                                width={"90px"}
                                                                borderRadius={36}
                                                            />
                                                            <Box ml={4}>
                                                                <Text fontWeight="bold">
                                                                    {cart.item.name}
                                                                </Text>
                                                                <Text fontSize="sm" color="gray.600">
                                                                    {cart.item.description}
                                                                </Text>
                                                            </Box>
                                                        </Flex>
                                                    </Td>
                                                    <Td>
                                                        Rp.
                                                        {Number(
                                                            cart.item.price
                                                            ).toLocaleString()}
                                                            /(pcs)
                                                    </Td>
                                                    <Td>
                                                        <Flex
                                                            alignItems="center"
                                                            justifyContent="center"
                                                            // mr="4px"
                                                        >
                                                            <QuantitySelector
                                                    initialStock={cart.item.stock}
                                                    price={cart.item.price}
                                                    onChange={(newQuantity) =>
                                                        handleQuantityChange(cart.id, newQuantity)
                                                    }
                                                    initialQuantity={cart.quantity}
                                                />
                                                        </Flex>
                                                    </Td>
                                                    <Td>
                                                        <Button
                                                            fontSize="14px"
                                                            fontWeight="bold"
                                                            ml={4}
                                                            bg="rgba(133, 81, 33, 1)"
                                                            color="white"
                                                            size="sm"
                                                            _hover={{
                                                                bg: "rgba(133, 81, 33, 0.8)",
                                                            }}
                                                            _active={{
                                                                bg: "rgba(133, 81, 33, 0.6)",
                                                            }}
                                                            onClick={() =>
                                                                handleRemove(
                                                                    cart.id
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Td>
                                                </Tr>
                                            ))}
                                            <Tr>
                                                <Td
                                                    colSpan="3"
                                                    textAlign="right"
                                                >
                                                    Total ({checkedItems.length}{" "}
                                                    produk):
                                                </Td>
                                                <Td>
                                                    Price: Rp.{" "}
                                                    {Number(
                                                    totalPrice
                                                    ).toLocaleString()}
                                                </Td>
                                            </Tr>
                                        </Tbody>
                                    </Table>
                                ) : (
                                    <Text>Your Shopping Cart is empty.</Text>
                                )}

                                {carts.length > 0 && (
                                <InertiaLink
                                    href={route("payment.post")}
                                    data={{ totalPrice, checkedItems }}
                                >
                                    <Box
                                        as="span"
                                        _hover={{
                                            bg: "rgba(133, 81, 33, 0.8)",
                                        }}
                                        _active={{
                                            bg: "rgba(133, 81, 33, 0.6)",
                                        }}
                                        fontSize="14px"
                                        fontWeight="bold"
                                        ml={4}
                                        bg="rgba(133, 81, 33, 1)"
                                        color="white"
                                        size="sm"
                                        p={2}
                                        borderRadius="md"
                                        display="inline-block"

                                    >
                                        Proceed to Payment
                                    </Box>
                                </InertiaLink>
                                )}
                            </Wrap>
                        </Box>
                    </Box>
                </AuthenticatedLayout>
            </FlashMessageHandler>
        </ChakraProvider>
    );
};

export default Cart;
