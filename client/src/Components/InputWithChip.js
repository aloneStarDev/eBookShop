import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { Input } from '@mui/material';

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
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          listStyle: 'none',
          p: 0.5,
          m: 0,
        }}
        component="ul"
      >
        {chipData.map((data, index) => {
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