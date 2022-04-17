import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import CssBaseLine from "@material-ui/core/CssBaseline";
import { getPlacesData, getWeatherData } from "./api";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";

import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(",")
    }
});

const App = () => {
    const [places, setPlaces] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState({});
    const [childClicked, setChildClicked] = useState(null);
    const [type, setType] = useState("restaurants");
    const [rating, setRating] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                setCoordinates({ lat: latitude, lng: longitude });
            }
        );
    }, []);

    useEffect(() => {
        const filteredPlaces = places.filter(place => place.rating > rating);
        setFilteredPlaces(filteredPlaces);
    }, [rating]);

    useEffect(() => {
        if (bounds.sw && bounds.ne) {
            setIsLoading(true);

            getWeatherData(coordinates.lat, coordinates.lng).then(data =>
                setWeatherData(data)
            );

            getPlacesData(type, bounds.sw, bounds.ne).then(data => {
                setPlaces(
                    data?.filter(place => place.name && place.num_reviews > 0)
                );
                setFilteredPlaces([]);
                setIsLoading(false);
            });
        }
    }, [bounds, type]);

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseLine />
                <Header setCoordinates={setCoordinates} />
                <Grid container spacing={3} style={{ width: "100%" }}>
                    <Grid item xs={12} md={4}>
                        <List
                            places={places}
                            childClicked={childClicked}
                            isLoading={isLoading}
                            type={type}
                            setType={setType}
                            rating={rating}
                            setRating={setRating}
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Map
                            coordinates={coordinates}
                            setCoordinates={setCoordinates}
                            setBounds={setBounds}
                            places={
                                filteredPlaces.length ? filteredPlaces : places
                            }
                            setChildClicked={setChildClicked}
                            weatherData={weatherData}
                        />
                    </Grid>
                </Grid>
            </ThemeProvider>
        </>
    );
};

export default App;
