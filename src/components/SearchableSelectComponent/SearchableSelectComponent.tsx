import { useState } from "react";
import { Box, Input, List, ListItem, Text } from "@chakra-ui/react";

//Types
import type { SearchableSelectProps } from "./SearchableSelectComponent.types";

const SearchableSelectComponent: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = "Selecciona una opción",
  value,
  onChange,
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  return (
    <Box position="relative" w="100%">
      <Input
        placeholder={placeholder}
        value={isOpen ? search : selectedLabel}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          mt={1}
          maxH="200px"
          overflowY="auto"
          zIndex={10}
        >
          <List>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <ListItem
                  key={opt.value}
                  px={3}
                  py={2}
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                  onClick={() => {
                    onChange(opt.value);
                    setSearch("");
                    setIsOpen(false);
                  }}
                >
                  <Text>{opt.label}</Text>
                </ListItem>
              ))
            ) : (
              <ListItem px={3} py={2}>
                <Text color="gray.500">No hay resultados</Text>
              </ListItem>
            )}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default SearchableSelectComponent;
