import { table, getMinifiedRecords, findRecordByFilter } from "@/lib/airtable";




const createCoffeeStore = async (req, res) => {

  if (req.method === "POST" ){

//find a record
    const {id, name, address, formatted_address, imgUrl, voting} = req.body;

    try{
        if(id) {

            const records = await findRecordByFilter(id);
          
            if (records.length !== 0){       
                res.json(records);
            } else {
        //creating a record
        if (name) {
    const createRecords = await table.create([
            {
                fields: {
                    id,
                    name,
                    address,
                    formatted_address,
                    voting,
                    imgUrl,
                },
            },
        ]);

        const records = getMinifiedRecords(createRecords);

        } else {
            res.status(400);
            res.json({ message: "id or name is missing" });
            }

        }
        }else {
            res.status(400);
            res.json({ message: "id is missing" });
            }
}       catch (err) {
                console.error('Error creating or finding a store', err);
                res.status(500);
                res.json({ message: 'Error creating or finding a store', err });
            }
}
};

export default createCoffeeStore;