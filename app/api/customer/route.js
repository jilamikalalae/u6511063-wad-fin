import Customer from "@/models/Customer";

// GET request to fetch all customers
export async function GET() {
    try {
        const customers = await Customer.find({}).sort({ name: 1 });
        return new Response(JSON.stringify(customers), { status: 200 });
    } catch (error) {
        console.error('Error fetching customers:', error);
        return new Response(JSON.stringify({ message: 'Error fetching customers' }), { status: 500 });
    }
}

// POST request to create a new customer
export async function POST(request) {
    try {
        const body = await request.json();
        const newCustomer = new Customer(body);
        await newCustomer.save();
        return new Response(JSON.stringify(newCustomer), { status: 201 });
    } catch (error) {
        console.error('Error creating customer:', error);
        return new Response(JSON.stringify({ message: 'Error creating customer' }), { status: 500 });
    }
}
