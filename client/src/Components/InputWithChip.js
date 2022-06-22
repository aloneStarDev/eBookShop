import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { Input, Typography } from '@mui/material';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function ChipsArray({ ...props }) {
  const { chipData, setChipData } = props;
  const [item, setItem] = React.useState("");
  const handleDelete = (searchIndex) => () => {
    let new_chip_data = [...chipData]
    new_chip_data.splice(searchIndex, 1)
    setChipData(new_chip_data);
  };

  return (
    <>
      <Input
        placeholder={props.placeholder || ""}
        startAdornment={props.startAdornment || null}
        value={item}
        onChange={e => setItem(e.target.value)}
        onKeyPress={(ev) => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            if (chipData.indexOf(item) === -1 && item !== "")
              setChipData([...chipData, item])
            setItem("")
          }
        }}
      />
      <Paper
        style={{
          minHeight: "40px",
        }}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          listStyle: 'none',
          border: "2px dashed",
          borderColor: "background.primary",
          p: 0.5,
          m: 0,
          mt: 1,
        }}
        component="ul"
      >

        {
          chipData.length === 0
            ? (props.itemPlaceholder !== undefined && <Typography sx={{ textAlign: "center", width: "100%" }} variant="inherit" >{props.itemPlaceholder}</Typography>)
            : chipData.map((data, index) => {
              return (
                <ListItem key={index}>
                  <Chip
                    label={data}
                    onDelete={handleDelete(index)}
                  />
                </ListItem>
              );
            })}
      </Paper>
    </>
  );
}