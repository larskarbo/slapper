import React, { useRef } from "react";

import InputGroup from "react-bootstrap/InputGroup";
import RBButton from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import useClipboard from "react-use-clipboard";
import { MdContentCopy, MdCheck, MdLink } from "react-icons/md";

export default function LinkShare({ link }) {
  const [isCopied, setCopied] = useClipboard(link);
  return (
    <InputGroup
      style={{
        maxWidth: 400,
      }}
      size="sm"
      className="mb-3"
    >
      <InputGroup.Prepend>
        <InputGroup.Text  style={{
        fontSize: 10
      }}><MdLink style={{paddingRight: 2}} /> Share link:</InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl style={{
        fontSize: 10
      }} value={link} />

      <InputGroup.Append>
        <RBButton  style={{
        fontSize: 10
      }} variant="outline-secondary" onClick={setCopied}>
          copy {isCopied ? <MdCheck /> : <MdContentCopy />}
        </RBButton>
      </InputGroup.Append>
    </InputGroup>
  );
}
