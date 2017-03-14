<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CombinedFragment extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'combined_fragments';
	
    protected $fillable = [
        'name',
        'operator',
    ];

    public function fragment()
    {
        return $this->morphOne(InteractionFragment::class, 'fragmentable');
    }
}
