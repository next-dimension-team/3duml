<?php

namespace App\JsonApi\InteractionFragments;

use CloudCreativity\LaravelJsonApi\Search\AbstractSearch;
use Illuminate\Database\Eloquent\Builder;
use Neomerx\JsonApi\Contracts\Encoder\Parameters\EncodingParametersInterface;
use Illuminate\Support\Collection;

class Search extends AbstractSearch
{
    /**
     * @inheritdoc
     */
    public function search(Builder $builder, EncodingParametersInterface $parameters)
    {
        $filters = new Collection((array) $parameters->getFilteringParameters());

        if ($filters->has('descendants')) {
            return $builder->find($filters->get('descendants'))->getDescendantsAndSelf();
        }

        return parent::search($builder, $parameters);
    }

    /**
     * @param Builder $builder
     * @param Collection $filters
     */
    protected function filter(Builder $builder, Collection $filters)
    {
        if ($filters->get('roots', false)) {
            $builder->whereNull($builder->getModel()->getParentColumnName());
        }
    }

    /**
     * @param Collection $filters
     * @return bool
     */
    protected function isSearchOne(Collection $filters)
    {
        return false;
    }

    /**
     * Apply a default sort order if the client has not requested any sort order.
     *
     * Child classes can override this method if they want to implement their
     * own default sort order.
     *
     * @param Builder $builder
     * @return void
     */
    protected function defaultSort(Builder $builder)
    {
        $builder->orderBy($builder->getModel()->getQualifiedOrderColumnName());
    }
}
