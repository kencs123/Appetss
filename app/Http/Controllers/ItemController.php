<?php

namespace App\Http\Controllers;
use App\Models\Item;
use Inertia\Inertia;
use Illuminate\Http\Request;


class ItemController extends Controller
{
    //
    public function index()
    {
         // Assuming you're using Laravel's default authentication
        $userId = auth()->id(); // Get the ID of the currently authenticated user

        // Fetch only the items that belong to this user
        $pets = Item::where('user_id', $userId)->get();
      
        return Inertia::render('Item/Index', [
            'pets' => $pets,
        ]);
    }
    public function create (){
        return Inertia::render('Item/Create');
    }
    public function pilihan (){
        return Inertia::render('Pilihan');
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'location' => 'required',
            'stock' => 'required|numeric',
            'image' => 'required|image',
        ]);
    
        $image = $request->file('image')->store('pet_images');

        Item::create([
            'user_id' => auth()->id(),
            
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'category_id' => $request->category_id,
            'location' => $request->location,
            'image' => $image,
            'stock' => $request->stock,
        ]);
    
        return redirect()->route('Profile.Homepages')->with('success', 'Item successfuly inserted!');
    }


public function show($item)
{
    $item = Item::find($item);

    if (!$item) {
        // Handle the case where the item is not found
        abort(404);
    }

    return Inertia::render('Item/Show', ['item' => $item]);
}

public function update(Request $request, $id)
{
    $request->validate([
        'name' => 'required',
        'description' => 'required',
        'price' => 'required|numeric',
        'category_id' => 'required|exists:categories,id',
        'location' => 'required',
        'image' => 'required|image',
        'stock' => 'required|numeric',
    ]);

    $item = Item::find($id);
    $item->update($request->all());

    return response()->json($item);
}

public function destroy(Item $item)
{
  
    $item->delete();

    return redirect()->route('item.index')->with('success', 'Data Berhasil Dihapus!');
}

public function edit($id)
{
    $item = Item::find($id);

    if (!$item) {
        // Handle the case where the item does not exist
        abort(404);
    }

    return Inertia::render('Item/Edit', ['item' => $item]);
}
}


