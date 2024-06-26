<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Item;
use App\Models\Category;
use Illuminate\Http\Request;


class HomepagesController extends Controller
{
   public function index(Request $request){
        $searchQuery = $request->input('search', '');
        $categoryName = $request->input('category', '');
        $type = $request->get('type');
        if (!empty($searchQuery)) {
            $pets = Item::where('name', 'LIKE', "%{$searchQuery}%")
                        ->orWhere('description', 'LIKE', "%{$searchQuery}%")
                        ->with('user')
                        ->get();
        } elseif (!empty($categoryName)) {
            $categoryIds = Category::where('name', $categoryName)->pluck('id');
            $pets = Item::whereIn('category_id', $categoryIds)
                        ->with('user')
                        ->get(); 
        } elseif($type){
            $categoryIds = Category::where('type', $type)->pluck('id');
            $pets = Item::whereIn('category_id', $categoryIds)
                        ->with('user')
                        ->get();
        }
        else {
            $pets = Item::with('user')->get();
        }

        return Inertia::render('Homepages', [
            'pets' => $pets,
        ]);
    }
}