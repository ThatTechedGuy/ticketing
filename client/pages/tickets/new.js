import { useCallback, useRef, useState } from "react";
import { TicketAPI } from "../../api/apiImpl";
import FormError from "../../components/error";
import Router, { Screens } from "../../navigation/routerUtils";

const NewTicket = () => {
  const ticketRef = useRef("");
  const priceRef = useRef(0);

  const [errors, setErrors] = useState();

  const onBlur = useCallback(() => {
    const price = priceRef.current.value;

    let value = parseFloat(price);

    if (isNaN(value)) {
      value = parseFloat(0);
    }

    priceRef.current.value = value.toFixed(2);
  }, []);

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();

    const title = ticketRef.current.value;
    const price = priceRef.current.value;

    const { errors } = await TicketAPI.createTicket(title, price);
    if (errors?.length) {
      setErrors(errors);
    } else {
      Router.push(Screens.ROOT);
    }
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <h1>Create a ticket!</h1>
      <div className="form-group">
        <label>Title</label>
        <input ref={ticketRef} className="form-control" />
      </div>
      <div className="form-group">
        <label>Price</label>
        <input
          ref={priceRef}
          onBlur={onBlur}
          value={priceRef.current.value}
          className="form-control"
        />
      </div>
      <button className="btn btn-primary mt-5">Submit</button>
      <FormError errors={errors} />
    </form>
  );
};

export default NewTicket;
