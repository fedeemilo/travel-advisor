import React, { useState, useEffect, createRef } from "react";
import {
    CircularProgress,
    Grid,
    Typography,
    InputLabel,
    MenuItem,
    FormControl,
    Select
} from "@material-ui/core";
import PlaceDetails from "../PlaceDetails/PlaceDetails";

import useStyles from "./styles";

const List = ({
    places,
    childClicked,
    isLoading,
    type,
    setType,
    rating,
    setRating
}) => {
    const classes = useStyles();
    const [elRefs, setElRefs] = useState([]);

    const listInputs = [
        {
            label: "Type",
            selectValue: type,
            onChange: e => setType(e.target.value),
            selectItems: [
                { text: "Restaurants", value: "restaurants" },
                { text: "Hotels", value: "hotels" },
                { text: "Attractions", value: "attractions" }
            ]
        },
        {
            label: "Rating",
            selectValue: rating,
            onChange: e => setRating(e.target.value),
            selectItems: [
                { text: "All", value: 0 },
                { text: "Above 3.0", value: 3 },
                { text: "Avobe 4.0", value: 4 },
                { text: "Avobe 4.5", value: 4.5 }
            ]
        }
    ];

    useEffect(() => {
        setElRefs(refs =>
            Array(places?.length)
                .fill()
                .map((_, i) => refs[i] || createRef())
        );
    }, [places]);

    return (
        <div className={classes.container}>
            <Typography variant="h4">
                Restaurants, Hotels & Attractions
            </Typography>

            {isLoading ? (
                <div className={classes.loading}>
                    <CircularProgress size="5rem" />
                </div>
            ) : (
                <>
                    {listInputs.map(
                        ({ label, selectValue, selectItems, onChange }) => (
                            <FormControl className={classes.formControl}>
                                <InputLabel>{label}</InputLabel>
                                <Select value={selectValue} onChange={onChange}>
                                    {selectItems.map(({ text, value }) => (
                                        <MenuItem value={value}>
                                            {text}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )
                    )}
                    <Grid container spacing={3} className={classes.list}>
                        {places?.map((place, i) => (
                            <Grid ref={elRefs[i]} item key={i} xs={12}>
                                <PlaceDetails
                                    place={place}
                                    selected={Number(childClicked) === i}
                                    refProp={elRefs[i]}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </div>
    );
};

export default List;
