## Caveat

As the task suggested, this should not take longer than 3 working hours, I tried to keep things as simple as possible while fulfilling the required functionalities. Backend is not necessarily needed for this task, but just for the purpose of showcasing my capability and familiarity on the backend side of things.

## Frontend

Well, obviously there is rooms of improvements in the aspect of design.

1. In term of product sense, the UI should be more aesthetic, color theme that align with the company identity should be applied.
2. Better user experience. For this prototyping, I'm clamping all the functionalities into one screen, in actual world this may split into different pages, e.g. only manager can see and use the Add or Remove Bots function. Perhaps the animation can be applied to the transition of order from PENDING to COMPLETED board or perhaps an audio clue can be applied.

## Backend

Here are the optimization that I can think of:

1. `Data Persistance` - Orders are crucial for the restaurant, I would suggest to persist the orders in some sort of database(it can be RDMS or noSQL). In event of service disruption, we still can use the persisted data to restore.
2. `Event driven` - in the BotService, I am using a 1 second intervals to check up is there any new order, this can be converted to an event-driven style where when new order is created, the OrderService emit an OrderCreated event and the BotService can listen to this event and react when new order created.
3. `Test` - in this task, I do not write any test cases. In actual practice, I take test seriously aspecially unit test and e2e integration test.
4. `Error handling` - proper error handling can be applied.
5. `Pagination & filtering` - for GET endpoints like /orders and /bots, pagination can be implemented to limit the size of the response.
6. `Containerized` - I would consider containerized the apps with tool like Docker for ease of shipping/deploying to different envs.
7. `Observability` - I would also consider a more proper logging and tracing with tools like OpenTelemetry.
