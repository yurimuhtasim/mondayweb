<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WarehouseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:warehouses,name,' . $this->route('warehouse'),
            'address' => 'required|string',
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'phone' => 'required|string|max:15'
        ];
    }
}
