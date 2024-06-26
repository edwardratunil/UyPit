<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\ValidationRule;
use Closure;

class StrongPassword implements ValidationRule
{
    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @param  \Closure  $fail
     * @return void
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!preg_match('/[\W]/', $value)) {
            $fail('The ' . $attribute . ' must contain at least one special character.');
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The :attribute must contain at least one special character.';
    }
}
